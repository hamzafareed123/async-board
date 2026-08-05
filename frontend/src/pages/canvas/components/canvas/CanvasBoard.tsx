import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Line, Ellipse, Arrow, Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useCanvasStore } from "../../../../store/canvas-store";
import { elementServices } from "../../../../services/element-services";
import { socket } from "../../../../config/socket";
import { transformToApiShape } from "../../../../utils/transformElement";

interface CanvasBoardProps {
  roomId:string
}
const CanvasBoard = ({roomId}:CanvasBoardProps) => {
  const { activeTool, elements, addElement, deleteElement } = useCanvasStore();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<any>(null);
  const [remotePreviews, setRemotePreviews] = useState<Record<string, any>>({});
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    visible: boolean;
    value: string;
  } | null>(null);

  useEffect(() => {
    const handleResize = () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handlePreview = (data: { shape: any }) => {
      setRemotePreviews((previews) => ({
        ...previews,
        [data.shape.id]: data.shape,
      }));
    };
    const handlePreviewEnd = (data: { shapeId: string }) => {
      setRemotePreviews((previews) => {
        const { [data.shapeId]: _, ...remainingPreviews } = previews;
        return remainingPreviews;
      });
    };

    socket.on("element:preview", handlePreview);
    socket.on("element:preview:end", handlePreviewEnd);

    return () => {
      socket.off("element:preview", handlePreview);
      socket.off("element:preview:end", handlePreviewEnd);
    };
  }, []);

  const getPos = (e: any) => {
    const stage = e.target.getStage();
    return stage.getPointerPosition();
  };

  const handleMouseDown = (e: any) => {
    if (activeTool === "Select") return;

    if (activeTool === "Text") {
      const pos = getPos(e);

      setTextInput({
        x: pos.x,
        y: pos.y,
        visible: true,
        value: "",
      });
      return;
    }

    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (activeTool === "Rectangle") {
      setCurrentShape({
        id: uuidv4(),
        type: "rect",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: "transparent",
        stroke: "#6366F1",
        strokeWidth: 2,
      });
    }

    if (activeTool === "Circle") {
      setCurrentShape({
        id: uuidv4(),
        type: "circle",
        x: pos.x,
        y: pos.y,
        radiusX: 0,
        radiusY: 0,
        fill: "transparent",
        stroke: "#6366F1",
        strokeWidth: 2,
      });
    }

    if (activeTool === "Line") {
      setCurrentShape({
        id: uuidv4(),
        type: "line",
        points: [pos.x, pos.y, pos.x, pos.y],
        fill: "transparent",
        stroke: "#6366F1",
        strokeWidth: 2,
      });
    }
    if (activeTool === "Arrow") {
      setCurrentShape({
        id: uuidv4(),
        type: "arrow",
        points: [pos.x, pos.y, pos.x, pos.y],
        pointerLength: 20,
        pointerWidth: 20,
        fill: "transparent",
        stroke: "#6366F1",
        strokeWidth: 1,
      });
    }
    if (activeTool === "Pen") {
      setCurrentShape({
        id: uuidv4(),
        type: "pen",
        points: [pos.x, pos.y],
        pointerLength: 20,
        pointerWidth: 20,
        fill: "transparent",
        stroke: "#6366F1",
        strokeWidth: 2,
        tension: 0.5,
        lineCap: "round",
        lineJoin: "round",
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentShape) return;

    const pos = getPos(e);

    if (activeTool === "Rectangle") {
      setCurrentShape((prev: any) => {
        const nextShape = {
        ...prev,
        width: pos.x - startPos.x,
        height: pos.y - startPos.y,
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }

    if (activeTool === "Circle") {
      setCurrentShape((prev: any) => {
        const nextShape = {
        ...prev,
        radiusX: Math.abs(pos.x - startPos.x) / 2,
        radiusY: Math.abs(pos.y - startPos.y) / 2,
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }

    if (activeTool === "Line") {
      setCurrentShape((prev: any) => {
        const nextShape = {
        ...prev,
        points: [prev.points[0], prev.points[1], pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
    if (activeTool === "Arrow") {
      setCurrentShape((prev: any) => {
        const nextShape = {
        ...prev,
        points: [prev.points[0], prev.points[1], pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
    if (activeTool === "Pen") {
      setCurrentShape((prev: any) => {
        const nextShape = {
        ...prev,
        points: [...prev.points, pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
  };

  const handleMouseUp = async() => {
    if (!isDrawing || !currentShape) return;

    socket.emit("element:preview:end", { roomId, shapeId: currentShape.id });

    // save to store
    addElement(currentShape);

    // clear live shape
    setCurrentShape(null);
    setIsDrawing(false);
    try {
      // save to DB
      const elementData = transformToApiShape(currentShape);
      const response = await elementServices.createElement(
        roomId,
        elementData,
      );

      // emit socket with DB element (has real _id)
      socket.emit("element:created", {
        roomId,
        element: response.data,
      });
    } catch (error) {
      console.log("failed to save element:", error);
    }
  };

  const renderElement = (el: any) => {
    if (el.type === "rect") {
      return (
        <Rect
          key={el.id}
          x={el.x}
          y={el.y}
          width={el.width}
          height={el.height}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }
    if (el.type === "circle") {
      return (
        <Ellipse
          key={el.id}
          x={el.x}
          y={el.y}
          radiusX={el.radiusX}
          radiusY={el.radiusY}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }
    if (el.type === "line") {
      return (
        <Line
          key={el.id}
          points={el.points}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          lineCap="round"
          lineJoin="round"
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }
    if (el.type === "arrow") {
      return (
        <Arrow
          key={el.id}
          points={el.points}
          pointerLength={el.pointerLength}
          pointerWidth={el.pointerWidth}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }

    if (el.type === "pen") {
      return (
        <Line
          key={el.id}
          points={el.points}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }
    if (el.type === "text") {
      return (
        <Text
          key={el.id}
          x={el.x}
          y={el.y}
          text={el.text}
          fontFamily={el.fontFamily}
          fill={el.fill}
          offsetX={el.offsetX}
          draggable={activeTool === "Select"}
          onMouseDown={() => handleEraserElement(el.id)}
        />
      );
    }

    return null;
  };

 const saveText = async () => {
    if (!textInput || !textInput.value.trim()) {
        setTextInput(null);
        return;
    }

    const textShape = {
        id: uuidv4(),
        type: "text",
        x: textInput.x,
        y: textInput.y,
        text: textInput.value,
        fontSize: 20,
        fontFamily: "Inter",
        fill: "#111827",
    };

    addElement(textShape);
    setTextInput(null);

    
    try {
        const elementData = transformToApiShape(textShape);
        const response = await elementServices.createElement(roomId, elementData);
        socket.emit("element:created", {
            roomId,
            element: response.data,
        });
    } catch (error) {
        console.log("failed to save text:", error);
    }
};
  const handleEraserElement = (id: string) => {
    if (activeTool === "Eraser") {
      deleteElement(id);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundImage:
          "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#FAFAFA",
        cursor: activeTool === "Select" ? "default" : "crosshair",
      }}
    >
      <Stage
        width={size.width}
        height={size.height}
        style={{ background: "transparent" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* saved elements */}
          {elements.map(renderElement)}

          {/* live previews from other users */}
          {Object.values(remotePreviews).map(renderElement)}

          {/* currently drawing shape — live preview */}
          {currentShape && currentShape.type === "rect" && (
            <Rect
              x={currentShape.x}
              y={currentShape.y}
              width={currentShape.width}
              height={currentShape.height}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
            />
          )}
          {currentShape && currentShape.type === "circle" && (
            <Ellipse
              x={currentShape.x}
              y={currentShape.y}
              radiusX={currentShape.radiusX}
              radiusY={currentShape.radiusY}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
            />
          )}
          {currentShape && currentShape.type === "line" && (
            <Line
              points={currentShape.points}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {currentShape && currentShape.type === "arrow" && (
            <Arrow
              points={currentShape.points}
              pointerWidth={currentShape.pointerWidth}
              pointerLength={currentShape.pointerLength}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
            />
          )}
          {currentShape && currentShape.type === "pen" && (
            <Line
              points={currentShape.points}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {currentShape && currentShape.type === "text" && (
            <Text
              x={currentShape.x}
              y={currentShape.y}
              text={currentShape.text}
              fontFamily={currentShape.fontFamily}
              fill={currentShape.fill}
              offsetX={currentShape.offsetX}
            />
          )}
        </Layer>
      </Stage>
      {textInput?.visible && (
        <input
          autoFocus
          type="text"
          value={textInput.value}
          onChange={(e) =>
            setTextInput((prev) =>
              prev ? { ...prev, value: e.target.value } : null,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") saveText();
            if (e.key === "Escape") setTextInput(null);
          }}
          style={{
            position: "absolute",
            top: textInput.y,
            left: textInput.x,
            background: "white",
            border: "1.5px dashed #6366F1",
            borderRadius: "4px",
            outline: "none",
            fontSize: "20px",
            fontFamily: "Inter",
            color: "#111827",
            minWidth: "120px",
            padding: "4px 8px",
            zIndex: 9999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      )}
    </div>
  );
};

export default CanvasBoard;

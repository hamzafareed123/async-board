import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Line, Ellipse } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useCanvasStore } from "../../../../store/canvas-store";

const CanvasBoard = () => {
  const { activeTool, elements, addElement } = useCanvasStore();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<any>(null);

  useEffect(() => {
    const handleResize = () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPos = (e: any) => {
    const stage = e.target.getStage();
    return stage.getPointerPosition();
  };

  const handleMouseDown = (e: any) => {
    if (activeTool === "Select") return;

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
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentShape) return;

    const pos = getPos(e);

    if (activeTool === "Rectangle") {
      setCurrentShape((prev: any) => ({
        ...prev,
        width: pos.x - startPos.x,
        height: pos.y - startPos.y,
      }));
    }

    if (activeTool === "Circle") {
      setCurrentShape((prev: any) => ({
        ...prev,
        radiusX: Math.abs(pos.x - startPos.x) / 2,
        radiusY: Math.abs(pos.y - startPos.y) / 2,
      }));
    }

    if (activeTool === "Line") {
      setCurrentShape((prev) => ({
        ...prev,
        points: [prev.points[0], prev.points[1], pos.x, pos.y],
      }));
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentShape) return;

    // save to store
    addElement(currentShape);

    // clear live shape
    setCurrentShape(null);
    setIsDrawing(false);
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
        />
      );
    }
    return null;
  };

  return (
    <div
      style={{
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
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasBoard;

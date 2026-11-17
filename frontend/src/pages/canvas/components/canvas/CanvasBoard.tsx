import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Line, Ellipse, Arrow, Text, Circle, Group, Image as KonvaImage } from "react-konva";
import type Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { useCanvasStore } from "../../../../store/canvas-store";
import { elementServices } from "../../../../services/element-services";
import { socket } from "../../../../config/socket";
import { transformToApiShape, transformToKonvaShape } from "../../../../utils/transformElement";
import { tools } from "../../../../data/ToolsData";
import type { CanvasElement, CanvasShape } from "../../../../types/canvas-types";

interface CanvasBoardProps {
  roomId: string;
  cursors: {
    [userId: string]: {
      x: number;
      y: number;
      fullName: string;
      cursorColor: string;
    };
  };
}
const CanvasBoard = ({ roomId, cursors }: CanvasBoardProps) => {
  const { activeTool, elements, addElement, updateElement, deleteElement, setActiveTool } = useCanvasStore();

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const stageRef = useRef<Konva.Stage | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<CanvasShape | null>(null);
  const [remotePreviews, setRemotePreviews] = useState<Record<string, CanvasShape>>({});
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    visible: boolean;
    value: string;
    kind: "text" | "sticky";
  } | null>(null);
  const [exportError, setExportError] = useState(false);
  const [canvasMessage, setCanvasMessage] = useState<string | null>(null);
  const deletingIds = useRef(new Set<string>());

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
    const shortcuts = new Map(tools.filter((tool) => tool.label !== "Image").map((tool) => [tool.shortcut.toLowerCase(), tool.label]));
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.ctrlKey || event.metaKey || event.altKey || target?.isContentEditable ||
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      const tool = shortcuts.get(event.key.toLowerCase());
      if (tool) {
        event.preventDefault();
        setActiveTool(tool);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [setActiveTool]);

  useEffect(() => {
    const exportBoard = () => {
      if (!stageRef.current) return;
      try {
        const anchor = document.createElement("a");
        anchor.download = `${roomId || "syncboard"}-board.png`;
        anchor.href = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
        anchor.click();
      } catch {
        setExportError(true);
        window.setTimeout(() => setExportError(false), 4000);
      }
    };
    window.addEventListener("board:export", exportBoard);
    return () => window.removeEventListener("board:export", exportBoard);
  }, [roomId]);

  useEffect(() => {
    const addUploadedImage = ({ detail }: CustomEvent<{ src: string }>) => {
      const image = new window.Image();
      image.onload = () => {
        const maxWidth = Math.min(480, size.width * 0.6);
        const maxHeight = Math.min(360, size.height * 0.6);
        const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight, 1);
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));

        addElement({
          id: uuidv4(),
          type: "image",
          x: Math.round((size.width - width) / 2),
          y: Math.round((size.height - height) / 2),
          width,
          height,
          src: detail.src,
        });
        setActiveTool("Select");
      };
      image.src = detail.src;
    };

    window.addEventListener("board:image-selected", addUploadedImage as EventListener);
    return () => window.removeEventListener("board:image-selected", addUploadedImage as EventListener);
  }, [addElement, setActiveTool, size.height, size.width]);

  useEffect(() => {
    const handlePreview = (data: { shape: CanvasShape }) => {
      setRemotePreviews((previews) => ({
        ...previews,
        [data.shape.id]: data.shape,
      }));
    };
    const handlePreviewEnd = (data: { shapeId: string }) => {
      setRemotePreviews((previews) => {
        const remainingPreviews = { ...previews };
        delete remainingPreviews[data.shapeId];
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

  const getPos = (event: Konva.KonvaEventObject<MouseEvent>) => {
    return event.target.getStage()?.getPointerPosition() ?? { x: 0, y: 0 };
  };

  const handleMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool === "Select" || activeTool === "Eraser") return;

    if (activeTool === "Text") {
      const pos = getPos(event);

      setTextInput({
        x: pos.x,
        y: pos.y,
        visible: true,
        value: "",
        kind: "text",
      });
      return;
    }

    if (activeTool === "Sticky") {
      const pos = getPos(event);
      setTextInput({
        x: pos.x,
        y: pos.y,
        visible: true,
        value: "",
        kind: "sticky",
      });
      return;
    }

    const pos = getPos(event);
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
        x: pos.x,
        y: pos.y,
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
        x: pos.x,
        y: pos.y,
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
        x: pos.x,
        y: pos.y,
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

  const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentShape) return;

    const pos = getPos(event);

    if (activeTool === "Rectangle") {
      setCurrentShape((prev) => {
        if (!prev) return prev;
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
      setCurrentShape((prev) => {
        if (!prev) return prev;
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
      setCurrentShape((prev) => {
        if (!prev) return prev;
        const points = prev.points ?? [];
        const nextShape = {
          ...prev,
          points: [points[0] ?? 0, points[1] ?? 0, pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
    if (activeTool === "Arrow") {
      setCurrentShape((prev) => {
        if (!prev) return prev;
        const points = prev.points ?? [];
        const nextShape = {
          ...prev,
          points: [points[0] ?? 0, points[1] ?? 0, pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
    if (activeTool === "Pen") {
      setCurrentShape((prev) => {
        if (!prev) return prev;
        const nextShape = {
          ...prev,
          points: [...(prev.points ?? []), pos.x, pos.y],
        };
        socket.emit("element:preview", { roomId, shape: nextShape });
        return nextShape;
      });
    }
  };

  const handleMouseUp = async (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentShape) return;

    const pos = getPos(event);

    socket.emit("cursor:move", {
      roomId,
      cursorPosition: { x: pos.x, y: pos.y },
    });

    socket.emit("element:preview:end", { roomId, shapeId: currentShape.id });

    // clear live shape
    setCurrentShape(null);
    setIsDrawing(false);
    await saveElement(currentShape);
  };

  const saveElement = async (shape: CanvasShape) => {
    addElement(shape);
    setCanvasMessage(null);
    try {
      const response = await elementServices.createElement(roomId, transformToApiShape(shape));
      deleteElement(shape.id);
      addElement(transformToKonvaShape(response.data));
      socket.emit("element:created", { roomId, element: response.data });
    } catch (error) {
      deleteElement(shape.id);
      setCanvasMessage("Could not save that item. Check your connection and try again.");
      console.error("Failed to save canvas element:", error);
    }
  };

  const handleEraserElement = async (id: string) => {
    if (activeTool !== "Eraser" || deletingIds.current.has(id)) return;
    const element = elements.find((item) => item.id === id);
    if (!element) return;

    if (element.type === "image") {
      deleteElement(id);
      return;
    }

    deletingIds.current.add(id);
    deleteElement(id);
    setCanvasMessage(null);
    try {
      await elementServices.deleteElement(roomId, id);
      socket.emit("element:delete", { roomId, elementId: id });
    } catch (error) {
      addElement(element);
      setCanvasMessage("Could not erase that item. Check your connection and try again.");
      console.error("Failed to delete canvas element:", error);
    } finally {
      deletingIds.current.delete(id);
    }
  };

  const eraseOnMouseDown = (id: string) => (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool !== "Eraser") return;
    event.cancelBubble = true;
    void handleEraserElement(id);
  };

  const handleStickyDragEnd = async (id: string, event: Konva.KonvaEventObject<DragEvent>) => {
    const position = { x: event.target.x(), y: event.target.y() };
    const previous = elements.find((element) => element.id === id);
    if (!previous) return;
    updateElement(id, position);
    try {
      await elementServices.updateElement(roomId, id, { position });
      socket.emit("element:update", { roomId, elementId: id, change: { position } });
    } catch (error) {
      updateElement(id, { x: previous.x, y: previous.y });
      event.target.position(previous);
      setCanvasMessage("Could not move that note. Check your connection and try again.");
      console.error("Failed to move sticky note:", error);
    }
  };

  const renderElement = (el: CanvasElement) => {
    if (el.type === "rect") {
      return (
        <Rect
          key={el.id}
          x={el.x}
          y={el.y}
          width={el.width ?? 0}
          height={el.height ?? 0}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          draggable={activeTool === "Select"}
          onMouseDown={eraseOnMouseDown(el.id)}
        />
      );
    }
    if (el.type === "circle") {
      return (
        <Ellipse
          key={el.id}
          x={el.x}
          y={el.y}
          radiusX={el.radiusX ?? 0}
          radiusY={el.radiusY ?? 0}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          draggable={activeTool === "Select"}
          onMouseDown={eraseOnMouseDown(el.id)}
        />
      );
    }
    if (el.type === "line") {
      return (
        <Line
          key={el.id}
          points={el.points ?? []}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          hitStrokeWidth={Math.max(el.strokeWidth || 2, 12)}
          lineCap="round"
          lineJoin="round"
          draggable={activeTool === "Select"}
          onMouseDown={eraseOnMouseDown(el.id)}
        />
      );
    }
    if (el.type === "arrow") {
      return (
        <Arrow
          key={el.id}
          points={el.points ?? []}
          pointerLength={el.pointerLength}
          pointerWidth={el.pointerWidth}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          hitStrokeWidth={Math.max(el.strokeWidth || 2, 12)}
          draggable={activeTool === "Select"}
          onMouseDown={eraseOnMouseDown(el.id)}
        />
      );
    }

    if (el.type === "pen") {
      return (
        <Line
          key={el.id}
          points={el.points ?? []}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          hitStrokeWidth={Math.max(el.strokeWidth || 2, 12)}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          draggable={activeTool === "Select"}
          onMouseDown={eraseOnMouseDown(el.id)}
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
          onMouseDown={eraseOnMouseDown(el.id)}
        />
      );
    }

    if (el.type === "sticky") {
      return (
        <React.Fragment key={el.id}>
          <Group
            x={el.x}
            y={el.y}
            draggable={activeTool === "Select"}
            onMouseDown={eraseOnMouseDown(el.id)}
            onDragEnd={(event) => void handleStickyDragEnd(el.id, event)}
          >
            <Rect
              width={el.width}
              height={el.height}
              fill={el.fill || "#FEF3C7"}
              stroke="#E9C46A"
              strokeWidth={1}
              cornerRadius={8}
              shadowColor="#483A1A"
              shadowBlur={8}
              shadowOpacity={0.12}
              shadowOffsetY={3}
            />
            <Text
              x={14}
              y={14}
          width={Math.max(0, (el.width ?? 0) - 28)}
          height={Math.max(0, (el.height ?? 0) - 28)}
              text={el.text || ""}
              fontFamily={el.fontFamily || "Inter"}
              fontSize={el.fontSize || 16}
              fill="#514322"
              wrap="word"
              listening={false}
            />
          </Group>
        </React.Fragment>
      );
    }

    if (el.type === "image") {
      return <BoardImage key={el.id} element={el} draggable={activeTool === "Select"} onMouseDown={eraseOnMouseDown(el.id)} />;
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
      type: textInput.kind,
      x: textInput.x,
      y: textInput.y,
      text: textInput.value,
      width: textInput.kind === "sticky" ? 220 : 0,
      height: textInput.kind === "sticky" ? 160 : 0,
      fontSize: textInput.kind === "sticky" ? 16 : 20,
      fontFamily: "Inter",
      fill: textInput.kind === "sticky" ? "#FEF3C7" : "#111827",
      stroke: textInput.kind === "sticky" ? "#E9C46A" : "#111827",
      strokeWidth: 1,
    };

    setTextInput(null);
    await saveElement(textShape);
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
        ref={stageRef}
        width={size.width}
        height={size.height}
        style={{ background: "transparent" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect width={size.width} height={size.height} fill="#FAFAFA" listening={false} />
          {/* saved elements */}
          {elements.map(renderElement)}
          {Object.entries(cursors).map(([userId, cursor]) => (
            <React.Fragment key={userId}>
              {/* cursor dot */}
              <Circle
                x={cursor.x}
                y={cursor.y}
                radius={5}
                fill={cursor.cursorColor}
                listening={false}
              />
              {/* name label */}
              <Text
                x={cursor.x + 10}
                y={cursor.y + 10}
                text={cursor.fullName}
                fontSize={12}
                fill={cursor.cursorColor}
                listening={false}
              />
            </React.Fragment>
          ))}

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
              radiusX={currentShape.radiusX ?? 0}
              radiusY={currentShape.radiusY ?? 0}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
            />
          )}
          {currentShape && currentShape.type === "line" && (
            <Line
              points={currentShape.points ?? []}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {currentShape && currentShape.type === "arrow" && (
            <Arrow
              points={currentShape.points ?? []}
              pointerWidth={currentShape.pointerWidth}
              pointerLength={currentShape.pointerLength}
              fill={currentShape.fill}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
            />
          )}
          {currentShape && currentShape.type === "pen" && (
            <Line
              points={currentShape.points ?? []}
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
        <>
          {textInput.kind === "sticky" ? (
            <div style={{ position: "absolute", top: textInput.y, left: textInput.x, width: 220, zIndex: 9999, border: "1px solid #E9C46A", borderRadius: 8, background: "#FEF3C7", boxShadow: "0 8px 18px rgba(72,58,26,.15)" }}>
              <textarea
                autoFocus
                aria-label="Sticky note text"
                placeholder="Write a note…"
                value={textInput.value}
                onChange={(event) => setTextInput((previous) => previous ? { ...previous, value: event.target.value } : null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    void saveText();
                  }
                  if (event.key === "Escape") setTextInput(null);
                }}
                style={{ display: "block", boxSizing: "border-box", width: "100%", height: 124, resize: "none", border: 0, borderRadius: "8px 8px 0 0", outline: "none", background: "transparent", fontSize: 16, lineHeight: 1.45, fontFamily: "Inter", color: "#514322", padding: 14 }}
              />
              <div className="flex items-center justify-between border-t border-amber-200 px-2 py-1.5">
                <span className="px-1 text-[10px] text-amber-800">Ctrl + Enter to save</span>
                <button type="button" onClick={() => void saveText()} className="rounded-md bg-amber-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-900">Add note</button>
              </div>
            </div>
          ) : (
            <input
              autoFocus
              type="text"
              aria-label="Canvas text"
              value={textInput.value}
              onChange={(event) => setTextInput((previous) => previous ? { ...previous, value: event.target.value } : null)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void saveText();
                if (event.key === "Escape") setTextInput(null);
              }}
              style={{
                position: "absolute", top: textInput.y, left: textInput.x, background: "white",
                border: "1.5px dashed #6366F1", borderRadius: 4, outline: "none", fontSize: 20,
                fontFamily: "Inter", color: "#111827", minWidth: 120, padding: "4px 8px", zIndex: 9999,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </>
      )}
      {canvasMessage && (
        <div role="alert" className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-amber-800 shadow-lg">
          <span>{canvasMessage}</span>
          <button type="button" onClick={() => setCanvasMessage(null)} aria-label="Dismiss message" className="font-semibold text-amber-900">×</button>
        </div>
      )}
      {exportError && (
        <div role="status" className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-amber-800 shadow-lg">
          One of the images on this board can’t be exported. Remove it and try again.
        </div>
      )}
    </div>
  );
};

const BoardImage = ({
  element,
  draggable,
  onMouseDown,
}: {
  element: CanvasElement & { type: "image" };
  draggable: boolean;
  onMouseDown: (event: Konva.KonvaEventObject<MouseEvent>) => void;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadedImage = new window.Image();
    loadedImage.crossOrigin = "Anonymous";
    loadedImage.onload = () => setImage(loadedImage);
    loadedImage.src = element.src;
  }, [element.src]);

  if (!image) return null;

  return (
    <KonvaImage
      image={image}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      draggable={draggable}
      onMouseDown={onMouseDown}
    />
  );
};

export default CanvasBoard;

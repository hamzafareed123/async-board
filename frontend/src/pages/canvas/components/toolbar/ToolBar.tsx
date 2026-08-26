import { useRef } from "react";
import ToolButton from "./ToolButton";
import { tools } from "../../../../data/ToolsData";
import  { useCanvasStore } from "../../../../store/canvas-store";

const ToolBar = () => {
  const { activeTool, setActiveTool } = useCanvasStore();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        window.dispatchEvent(
          new CustomEvent("board:image-selected", { detail: { src: reader.result } }),
        );
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-surface border border-border rounded-xl shadow-sm">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelection}
      />
      {tools.map((tool) => (
        <ToolButton
          key={tool.label}
          label={tool.label}
          icon={tool.icon}
          shortcut={tool.shortcut}
          isActive={activeTool === tool.label}
          onClick={() => {
            if (tool.label === "Image") {
              imageInputRef.current?.click();
              return;
            }
            setActiveTool(tool.label);
          }}
        />
      ))}
    </div>
  );
};

export default ToolBar;

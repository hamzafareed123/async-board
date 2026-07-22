import ToolButton from "./ToolButton";
import { tools } from "../../../../data/ToolsData";
import  { useCanvasStore } from "../../../../store/canvas-store";

const ToolBar = () => {
  const { activeTool, setActiveTool } = useCanvasStore();

  return (
    <div className="flex flex-col gap-1 p-2 bg-surface border border-border rounded-xl shadow-sm">
      {tools.map((tool) => (
        <ToolButton
          key={tool.label}
          label={tool.label}
          icon={tool.icon}
          shortcut={tool.shortcut}
          isActive={activeTool === tool.label}
          onClick={() => setActiveTool(tool.label)}
        />
      ))}
    </div>
  );
};

export default ToolBar;

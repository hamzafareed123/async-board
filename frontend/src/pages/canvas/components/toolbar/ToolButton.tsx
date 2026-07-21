import type { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  shortcut?: string;
}

const ToolButton = ({ icon: Icon, label, isActive, onClick, shortcut }: ToolButtonProps) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        title={label}
        className={`flex items-center cursor-pointer justify-center w-9 h-9 rounded-lg transition-all
          ${isActive
            ? "bg-primary text-white"
            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
          }`}
      >
        <Icon size={18} />
      </button>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1
        bg-surface border border-border rounded-md text-xs text-text-primary
        whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
        {label}
        {shortcut && (
          <span className="ml-2 text-text-secondary">{shortcut}</span>
        )}
      </div>
    </div>
  );
};

export default ToolButton;
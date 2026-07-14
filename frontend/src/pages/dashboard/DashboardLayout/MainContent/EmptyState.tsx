import { LayoutDashboard } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {

    
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          <LayoutDashboard size={48} className="text-text-secondary mb-4" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mt-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary mt-1 max-w-xs">
          {description}
        </p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-6 px-4 py-2 bg-primary text-white text-sm 
            font-medium rounded-lg hover:bg-primary-hover transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

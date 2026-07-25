import { LayoutDashboard } from "lucide-react";
import Button from "../../../../components/ui/button";

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
        <p className="text-sm text-text-secondary mt-1 max-w-xs mb-4">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} label={actionLabel} />
        )}
      </div>
    </div>
  );
};

export default EmptyState;

import React from "react";
import { useAuthStore } from "../../../../store/auth-store";
import Button from "../../../../components/ui/button";

interface DashboardHeaderProps {
  onCreate?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreate }) => {
  const { authUser } = useAuthStore();
  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/90">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary sm:text-4xl">
            Welcome back{authUser?.fullName ? `, ${authUser.fullName}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Create a board to start organizing your ideas and collaborating with
            your team in one beautiful workspace.
          </p>
        </div>

        <Button label="Create board" onClick={onCreate ?? (() => {})} variant="primary" />
      </div>
    </div>
  );
};

export default DashboardHeader;

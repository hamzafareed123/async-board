import { Link } from "react-router-dom";
import { ChevronRight, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import { useAuthStore } from "../../../../store/auth-store";

interface NavItemProps {
  onSelect?: (panel: string) => void;
  activePanel?: string;
}

const NavItem: React.FC<NavItemProps> = ({ onSelect, activePanel }) => {
  const { authUser } = useAuthStore();
  const isBoardsActive = activePanel === "boards";
  const isProfileActive = activePanel === "user-profile";

  const {logout} = useAuthStore()


  const handleLogout = async ()=>{
    await logout();
  }

  return (
    <nav className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="border-b border-border px-2 pb-6">
        <Link to="/" className="inline-flex" aria-label="Go to home page">
          <Logo size={120} />
        </Link>
      </div>

      <div className="px-2 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        Workspace
      </div>

      <ul className="mt-3 flex flex-1 flex-col gap-1">
        <li>
          <button
            type="button"
            onClick={() => onSelect?.("boards")}
            aria-current={isBoardsActive ? "page" : undefined}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              isBoardsActive
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            }`}
          >
            <LayoutDashboard size={18} strokeWidth={2} />
            <span>My boards</span>
          </button>
        </li>

        <li className="mt-auto border-t border-border pt-4">
          <button
            type="button"
            onClick={() => onSelect?.("user-profile")}
            aria-current={isProfileActive ? "page" : undefined}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition ${
              isProfileActive ? "bg-primary-light" : "hover:bg-surface-2"
            }`}
          >
            <UserAvatar
              profilePic={authUser?.profilePic}
              size={40}
              className="border border-border"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-text-primary">
                {authUser?.fullName || "Your profile"}
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                <UserRound size={12} />
                Profile
              </span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-text-muted" />
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-red-50 hover:text-error"
          >
            <LogOut size={17} />
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavItem;

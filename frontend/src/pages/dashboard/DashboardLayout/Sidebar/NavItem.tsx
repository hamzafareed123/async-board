import { Link } from "react-router-dom"; // Install via npm i react-router-dom
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

interface NavItemProps {
  onSelect?: (panel: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ onSelect }) => {
  return (
    <nav className="flex h-full flex-col p-6">
      <div>
        <Link to="/">
          <Logo size={120} />
        </Link>
      </div>

      <ul className="mt-10 flex flex-1 flex-col">
        <li>
          <button
            type="button"
            onClick={() => onSelect?.("boards")}
            className="w-full cursor-pointer rounded-lg px-4 py-3 text-left text-text-primary transition hover:bg-surface-2"
          >
            My Boards
          </button>
        </li>

        <li className="mt-auto">
          <button
            type="button"
            onClick={() => onSelect?.("user-profile")}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-text-primary transition hover:bg-surface-2"
          >
            <UserAvatar />
          </button>
          <span>Profile</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavItem;

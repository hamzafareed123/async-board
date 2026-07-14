import { Link } from "react-router-dom"; // Install via npm i react-router-dom
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

interface NavItemProps {
  onSelect?: (panel: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ onSelect }) => {
  return (
    <nav className="navbar flex h-full flex-col items-start gap-6 p-4">
      <div className="nav-logo w-full">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <ul className="nav-menu flex w-full flex-1 flex-col gap-2">
        <li className="nav-item w-full">
          <button 
            type="button"
            onClick={() => onSelect && onSelect("boards")}
            className="w-full text-left nav-link cursor-pointer"
          >
            My Boards
          </button>
        </li>
        <li className="nav-item mt-auto w-full">
          <Link to="/profile" className="nav-link flex items-center gap-2 cursor-pointer">
            <UserAvatar />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavItem;

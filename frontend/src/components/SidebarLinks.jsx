import { Link, useLocation } from "react-router";
import { HomeIcon, UsersIcon, BellIcon } from "lucide-react";

const SidebarLinks = ({ onClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Link
        to="/"
        onClick={onClick}
        className={`btn btn-ghost justify-start w-full gap-3 ${
          currentPath === "/" ? "btn-active" : ""
        }`}
      >
        <HomeIcon className="size-5 opacity-70" />
        Home
      </Link>

      <Link
        to="/friends"
        onClick={onClick}
        className={`btn btn-ghost justify-start w-full gap-3 ${
          currentPath === "/friends" ? "btn-active" : ""
        }`}
      >
        <UsersIcon className="size-5 opacity-70" />
        Friends
      </Link>

      <Link
        to="/notifications"
        onClick={onClick}
        className={`btn btn-ghost justify-start w-full gap-3 ${
          currentPath === "/notifications" ? "btn-active" : ""
        }`}
      >
        <BellIcon className="size-5 opacity-70" />
        Notifications
      </Link>
    </>
  );
};

export default SidebarLinks;
import { useLocation, Link, useNavigate } from "react-router";
import useAuthUser from "../hooks/userAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInstance } from "../lib/api";
import {
  MessageCircle,
  LogOutIcon,
  Menu,
  BookOpenCheck,
  Bell
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import SidebarLinks from "./SidebarLinks";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isChatPage = location.pathname.endsWith("/chat");

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: () =>
      fetchInstance("/auth/signout", {
        method: "POST",
      }),

    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      navigate("/login", { replace: true });
    },
  });

  if (isChatPage) return null;

  return (
    <header className="navbar bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-50">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="size-6" />
          </label>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-[100] w-64 rounded-box bg-base-200 p-2 shadow"
          >
            <SidebarLinks />
          </ul>
        </div>
      </div>

      {/* Center */}
      <div className="">
        <Link to="/" className="flex items-center gap-2">
          <MessageCircle className="size-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden md:block">
            Streamophone
          </span>
        </Link>
      </div>

      {/* Right */}
      <div className="navbar-end gap-2">
        <ThemeSelector />

        <Link to="/notifications" className="flex items-center gap-2 mr-5">
          <Bell className="size-6 text-primary" />
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar cursor-pointer"
          >
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={authUser?.profilePic}
                alt={authUser?.fullName}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 w-56 rounded-box bg-base-200 p-2 shadow z-[100]"
          >
            <li className="menu-title">
              <span>{authUser?.fullName}</span>
            </li>

            <li>
              
                <Link to = '/onboarding'
                disabled={isPending}
              >
                <BookOpenCheck className="size-4" />
                {isPending ? "Onboard" : "Onboarded"}
              </Link>
            </li>

            <li>
              <button
                onClick={() => logoutMutation()}
                disabled={isPending}
              >
                <LogOutIcon className="size-4" />
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
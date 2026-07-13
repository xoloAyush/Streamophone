import { useLocation, Link, useNavigate } from 'react-router'
import useAuthUser from '../hooks/userAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import toast from 'react-hot-toast'
import { fetchInstance } from '../lib/api'
import { MessageCircle, BellIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from './ThemeSelector'

const Navbar = () => {

  const {authUser} = useAuthUser()
  const location = useLocation()
  const navigate = useNavigate()

  const isChatPage = location.pathname?.endsWith('/chat')

  const queryClient = useQueryClient()

  const {mutate:logoutMutation} = useMutation({

    mutationFn: async () => {

        const response = await fetchInstance("/auth/signout", {
        method: "POST",
        body: JSON.stringify(),
      });

      console.log(response);
      return response
      },

      onSuccess: async () => {
  queryClient.setQueryData(["authUser"], null);

navigate("/login", { replace: true });
  },
  })


  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-19 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between w-full">
          <div>
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <MessageCircle className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}
          </div>

          <div className='flex items-center gap-8'>

          
            <Link to={"/notifications"}>
              <button className="">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="cursor-pointer" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>

          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar
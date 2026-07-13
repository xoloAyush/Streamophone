import { useQuery } from "@tanstack/react-query";
// import axios from 'axios'
import { fetchInstance } from "../lib/api";

const useAuthUser = () => {

    const { data: authData, isLoading } = useQuery({
  queryKey: ["authUser"],
  queryFn: () => fetchInstance("/auth/me"),
  retry: false
    })
    

    return {isLoading: isLoading, authUser: authData?.user}
}

export default useAuthUser
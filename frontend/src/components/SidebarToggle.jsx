import { MenuIcon } from "lucide-react"
import { useSidebar } from "../context/SidebarContext"

const SidebarToggle = () => {
  const { toggle } = useSidebar()
  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle">
      <MenuIcon className="size-5" />
    </button>
  )
}

export default SidebarToggle
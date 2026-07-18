import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    // h-[100dvh] (with h-screen fallback) CLAMPS the page to exactly
    // one viewport — min-h-screen only sets a floor, it lets content grow taller.
    // overflow-hidden here means only inner regions scroll, never the whole page.
    <div className="h-[100dvh] h-screen flex overflow-hidden">
      {showSidebar && (
        // shrink-0: sidebar keeps its own width/height, never gets squashed
        // by the flex row. If the sidebar's own content can be tall,
        // give it its own overflow-y-auto too (see note below).
        <Sidebar className="shrink-0" />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Navbar takes exactly the height it needs, never shrinks */}
        <Navbar className="shrink-0" />

        {/* min-h-0 is the critical flexbox fix: without it, a flex child
            won't actually shrink to allow overflow-y-auto to activate —
            it'll just grow with its content and push everything else
            out of the viewport, which is the scrollbar bug you saw. */}
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
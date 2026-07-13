import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end  w-27 absolute top-0">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white"> 
        <VideoIcon className="size-8" />
      </button>
    </div>
  );
}

export default CallButton;
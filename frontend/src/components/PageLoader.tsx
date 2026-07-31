import { LoaderIcon } from "lucide-react";
function PageLoader() {
        return (
        <div className="min-h-screen w-full  mx-auto flex items-center justify-center  bg-[#0d0c0e] text-white p-4 ">
                <LoaderIcon className="size-10 animate-spin text-pink-800" />
        </div>
        );
}
export default PageLoader;
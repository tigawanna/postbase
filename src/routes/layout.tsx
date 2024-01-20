import { Nprogress } from "@/components/navigation/nprogress/Nprogress";
import {
  ClientSuspense,
  LayoutProps,
  PageContext,
  useLocation,
} from "rakkasjs";
import "./index.css";


import { Sidebar } from "@/components/navigation/bars/sidebar";
import Toaster from "@/components/wrappers/DefaltExportedToaster";
import ErrorBoundaryComponent from "@/components/navigation/ErrorBoundaryComponent";
import BreadCrumbs from "@/components/navigation/BreadCrumbs";

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // console.log(" page ctx ==== ",page_ctx.locals.pb)
  return (
    <ErrorBoundaryComponent>
      <div className="w-full h-screen overflow-y-hidden  flex flex-col items-center ">
        {/* <Head description={"Resume building assistant"} /> */}
        <ClientSuspense fallback={<div></div>}>
          <Nprogress
            isAnimating={location && location?.pending ? true : false}
          />
        </ClientSuspense>
        <div className="w-full flex h-screen gap-2">
          <div className="min-w-[5%] w-fit flex h-full gap-2">
            <Sidebar />
          </div>
          <div className="w-full max-h-[97vh] flex flex-col gap-2 pt-2">

            <div className="w-fit flex rounded-xl p-auto">
            <ClientSuspense fallback={<div className="h-5"></div>}>
              <BreadCrumbs />
            </ClientSuspense>
          </div>
          <ErrorBoundaryComponent>
            {children}
            </ErrorBoundaryComponent>
          </div>
        </div>
        <ClientSuspense fallback={<div></div>}>
          <Toaster />
        </ClientSuspense>

      </div>
    </ErrorBoundaryComponent>
  );
}
Layout.preload = (ctx: PageContext) => {
  return {
    head: {
      title: "Postbase",
      description: "simple postgres gui",
    },
  };
};



export default Layout;

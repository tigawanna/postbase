import { Button } from "@/components/shadcn/ui/button";
import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { Loader } from "lucide-react";
import postgres from "postgres";
import { PageProps, Redirect, useSSM, useSSQ } from "rakkasjs";
export default function TestPage({url}: PageProps) {
  const mutation = useSSM(async (ctx) => {
    try {
      // const sql = postgresInstance(vars.config);
      // await sql.end();
      ctx.deleteCookie("pg_config", {
        path: "/",
      });
      // console.log(" ctx.cookie  === ", ctx.cookie);
      // console.log("======= loogged out of db ,deleted cookie =======");
      return { success: true, error: null };
    } catch (error: any) {
      console.log("======== error loggin out of db ======= ", error);
      return { success: false, error: error.message };
    }
  });
  if(mutation.data?.success){
    const new_url = new URL(url)
    new_url.pathname = "/auth"
    // console.log(" ====== new url ============ ",url)
    new_url.searchParams.set("redirect", url.pathname)
    return <Redirect href={new_url.toString()}/>
  }
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <p>test page</p>
      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isLoading}
        className=""
      >
        Logout{" "}
        {mutation.isLoading && <Loader className="w-4 h-4 animate-spin" />}
      </Button>
    </div>
  );
}

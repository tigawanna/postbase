import { Button } from "@/components/shadcn/ui/button";
import { deletePGCookie } from "@/lib/pg/pg";
import { Loader } from "lucide-react";

import {
  PageProps,
  navigate,
  useQueryClient,
  useSSM,
} from "rakkasjs";
export default function TestPage({ url }: PageProps) {
  const qc = useQueryClient();
  const mutation = useSSM(async (ctx) => {
    try {
      ctx.deleteCookie("pg_cookie", {
        path: "/",
      });
      deletePGCookie(ctx);
      return { success: true, error: null };
    } catch (error: any) {
      console.log("======== error loggin out of db ======= ", error);
      return { success: false, error: error.message };
    }
  });

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <p>test page</p>
      <Button
        onClick={() =>
          mutation.mutateAsync().then((res) => {
            const new_url = new URL(url);
            new_url.pathname = "/auth";
            new_url.searchParams.set("redirect", url.pathname);
            qc.setQueryData("pg_config", null);
            navigate(new_url.toString());
          })
        }
        disabled={mutation.isLoading}
        className="flex items-center justify-center gap-4"
      >
        Logout{" "}
        {mutation.isLoading && <Loader className="w-4 h-4 animate-spin" />}
      </Button>
    </div>
  );
}

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader } from "lucide-react";
import postgres from "postgres";
import { navigate, usePageContext, useQueryClient, useSSM } from "rakkasjs";
import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { RemoteDBAuthProps, deletePGCookie, setPGCookie } from "@/lib/pg/pg";

interface RemoteDBAuthFormProps {}

export function RemoteDBAuthForm({}: RemoteDBAuthFormProps) {
    const qc = useQueryClient();
      const page_ctx = usePageContext();
  const [input, setInput] = useState<RemoteDBAuthProps>({
    local_or_remote: "remote",
    connection_url: "",
  });
  const mutation = useSSM(async (ctx, vars: RemoteDBAuthProps) => {
    try {
      const sql = postgres(input.connection_url, {
        idle_timeout: 20,
        max_lifetime: 60 * 30,
      });
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      setPGCookie(ctx, JSON.stringify(vars));
      return { result: { database,config:vars }, error: null };
    } catch (error: any) {
      console.log(" === remote postgres connection error == ", error.message);
     deletePGCookie(ctx);
      return { result: null, error: error.message };
    }
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Remote</CardTitle>
          <CardDescription>
            Connect to a remote postgres instance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="connection_url">Connection Url</Label>
            <Input onChange={(e) => handleChange(e)} id="connection_url" />
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button
            onClick={() => mutation.mutate(input)}
            disabled={mutation.isLoading}
          >
            Connect {mutation.isLoading && <Loader className="animate-spin" />}
          </Button> */}

          <Button
            onClick={() => {
              mutation.mutateAsync(input).then((res) => {
                if (res.result) {
                  qc.setQueryData("pg_config", res.result?.config);
                  const redirect_search_param =
                    page_ctx.url.searchParams.get("redirect");
                  const redirect_to = redirect_search_param ?? "/";
                  // console.log(" ===== login success , redirecting to ==== ",redirect_to)
                  navigate(redirect_to);
                }
              });
            }}
            disabled={mutation.isLoading}
          >
            Connect {mutation.isLoading && <Loader className="animate-spin" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

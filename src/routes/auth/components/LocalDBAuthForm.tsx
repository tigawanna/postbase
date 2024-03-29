import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { LocalDBCombobox } from "@/routes/pg/components/LocalDBCombobox";
import { UserCombobox } from "@/routes/pg/components/UserCombobox";
import { Label } from "@radix-ui/react-label";
import { Loader } from "lucide-react";
import postgres from "postgres";
import {
  useSSQ,
  useSSM,
  usePageContext,
  useQueryClient,
  navigate,
} from "rakkasjs";
import {useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { LocalDBAuthProps, deletePGCookie, setPGCookie } from "@/lib/pg/pg";

interface LocalDBAuthFormProps {}
export function LocalDBAuthForm({}: LocalDBAuthFormProps) {
  const qc = useQueryClient();
  const page_ctx = usePageContext();
  const [input, setInput] = useState<LocalDBAuthProps>({
    local_or_remote: "local",
    db_host: "localhost",
    db_user: "postgres",
    db_password: "postgres",
    db_name: "postgres",
  });
  const query = useSSQ(async (ctx) => {
    try {
      const sql = postgres({
        host: input.db_host,
        user: input.db_user,
        password: input.db_password,
        database: input.db_name,
        idle_timeout: 20,
        max_lifetime: 60 * 30,
      });
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      const users = (await sql`SELECT * FROM pg_catalog.pg_user`) as any as [
        { usename: string },
      ];
      return { result: { database, users }, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { result: null, error: error.message };
    }
  });
  const mutation = useSSM(async (ctx, vars: LocalDBAuthProps) => {
    try {
      const sql = postgres({
        host: input.db_host,
        user: input.db_user,
        password: input.db_password,
        database: input.db_name,
        idle_timeout: 20,
      });
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      setPGCookie(ctx, JSON.stringify(vars));
      return { result: { succes: true, config: vars, database }, error: null };
    } catch (error: any) {
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

  const dbs = query?.data?.result?.database;
  const users = query?.data?.result?.users;


  return (
    <div className="w-full h-full  overflow-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Local</CardTitle>
          <CardDescription>
            Connect to a Postgres instance running locally
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* database user name */}
          <div className="space-y-1 bg-base-200 px-4  rounded-xl">
            <Label htmlFor="db_user" className="font-bold">
              DB User
            </Label>
            <div className="flex flex-col">
              {users && (
                <UserCombobox
                  users={users}
                  value={input.db_user}
                  setValue={(val) => {
                    console.log("set user", val);
                    setInput({
                      ...input,
                      db_user: val,
                    });
                  }}
                />
              )}
            </div>
            <Input
              onChange={(e) => handleChange(e)}
              id="db_user"
              defaultValue="postgres"
            />
          </div>
          {/* database password */}
          <div className="space-y-1 font-bold bg-base-200 px-4 py-1 rounded-xl">
            <Label htmlFor="db_password">DB Password</Label>
            <Input
              onChange={(e) => handleChange(e)}
              id="db_password"
              defaultValue="postgres"
            />
          </div>
          {/* database name */}
          <div className="space-y-1 bg-base-200 px-4 py-1 rounded-xl">
            <Label htmlFor="db_name" className="font-bold ">
              DB Name
            </Label>
            <div className="flex flex-col">
              {dbs && (
                <LocalDBCombobox
                  dbs={dbs}
                  value={input.db_name}
                  setValue={(val) => {
                    setInput({
                      ...input,
                      db_name: val,
                    });
                  }}
                />
              )}
            </div>

            <Input
              onChange={(e) => handleChange(e)}
              id="db_anme"
              defaultValue="postgres"
            />
          </div>

          {/* database host */}
          <div className="space-y-1 bg-base-200 px-4 py-1 rounded-xl">
            <Label htmlFor="db_host" className="font-bold">
              DB Host
            </Label>
            <Input
              onChange={(e) => handleChange(e)}
              id="db_host"
              defaultValue="localhost"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              mutation.mutateAsync(input).then((res) => {
                if (res.result) {
                  qc.setQueryData("pg_config", res.result.config);
                  const redirect_search_param =
                    page_ctx.url.searchParams.get("redirect");
                  const redirect_to = redirect_search_param ?? "/";
                  console.log(" ===== login success , redirecting to ==== ",redirect_to)
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

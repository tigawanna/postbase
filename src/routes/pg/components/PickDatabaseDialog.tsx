import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { navigate, usePageContext, useSSM } from "rakkasjs";
import { useEffect, useState } from "react";
import { UserCombobox } from "./UserCombobox";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn/ui/alert";
import { ChevronRightSquare, Loader } from "lucide-react";
import postgres from "postgres";
import { Button } from "@/components/shadcn/ui/button";
import { isString } from "@/utils/helpers/string";
import { hotToast } from "@/utils/helpers/toast";
import { LocalDBAuthProps, deletePGCookie, setPGCookie } from "@/lib/pg/pg";

interface PickDatabaseDialogProps {
  datname: string;
  users:
    | [
        {
          usename: string;
        },
      ]
    | undefined;
}
export function PickDatabaseDialog({
  datname,
  users,
}: PickDatabaseDialogProps) {
  const [input, setInput] = useState({
    user: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }

  const mutation = useSSM(
    async (
      ctx,
      vars: { datname: string; input: { user: string; password: string } },
    ) => {
      try {
        // console.log(" ==== logging into DB === ", vars);
        const sql = postgres({
          host: "localhost",
          user: vars.input.user,
          password: vars.input.password,
          database: vars.datname,
          idle_timeout: 20,
        });
        const tables =
          await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'`;
        // console.log("===== db connected === ", tables);
        const pg_cookie: LocalDBAuthProps = {
          db_host: "localhost",
          db_name: vars.datname,
          db_password: vars.input.password,
          db_user: vars.input.user,
          local_or_remote: "local",
        };
        setPGCookie(ctx, JSON.stringify(pg_cookie));
        // ctx.setCookie("pg_config", JSON.stringify(pg_cookie));
        return { data: "Successfully logged in", error: null };
      } catch (error: any) {
        deletePGCookie(ctx);
        console.log(" ==== error logging into DB === ", error.message);
        return { data: undefined, error: error.message };
      }
    },
  );

  const mutation_error = mutation.data?.error || mutation.error;
  const page_ctx = usePageContext();
  const db_page_url = new URL(page_ctx.url);



  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="">
          <div className="text-xl flex  font-bold text-center justify-center items-center gap-4">
            {datname} <ChevronRightSquare />
          </div>
        </div>
        {/* <Button variant="outline">Open</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{datname}</DialogTitle>

          <Alert className="">
            <AlertTitle className="text-accent">Hint</AlertTitle>
            <AlertDescription>
              password default is usually 'postgres'
            </AlertDescription>
          </Alert>

          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="flex flex-col justify-center  gap-4 py-4">
          <div className="flex flex-col  gap-4">
            <div className="flex flex-col">
              {users && (
                <UserCombobox
                  users={users}
                  value={input.user}
                  setValue={(val) => {
                    setInput({
                      ...input,
                      user: val,
                    });
                  }}
                />
              )}
            </div>
            <div className="flex flex-col  gap-1">
              <Label htmlFor="name" className="">
                Name
              </Label>
              <Input
                id="user"
                value={input.user}
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col  gap-2  ">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input
              id="password"
              value={input.password}
              className="col-span-3"
              onChange={handleChange}
              style={{
                border: isString(mutation_error) ? "1px solid red" : "",
              }}
            />
          </div>
        </form>
        <DialogFooter>
   
          <Button
            className="rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 
            flex gap-4 place-content-center"
            disabled={
              !isString(input.user) ||
              !isString(input.password) ||
              mutation.isLoading
            }
            onClick={() => {
         
                mutation.mutateAsync({ datname, input }).then((res) => {
                  // console.log(" ==== pick db  res ==== ", res);
                      if (isString(mutation_error) || mutation.isError) {
                        hotToast({
                          title: "Error",
                          description: mutation_error,
                          type: "error",
                        });
                      }
                      if (res?.data) {
                        hotToast({
                          title: "Success",
                          description: mutation.data?.data ?? "",
                          type: "success",
                        });
                        db_page_url.pathname = `/pg/${datname}`;
                        console.log(" === picking database db_page_url === ", db_page_url);
                        navigate(db_page_url.toString());
                      }
                })
              
            }}
          >
            Login{" "}
            {mutation.isLoading && <Loader className="animate-spin h-5 w-5" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

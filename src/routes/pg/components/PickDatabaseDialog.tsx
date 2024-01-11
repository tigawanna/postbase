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
import { Link, navigate, usePageContext, useSSM } from "rakkasjs";
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
import { toast } from "sonner";
import { hotToast } from "@/utils/helpers/toast";

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
        const sql = postgres({
          host: "localhost",
          user: vars.input.user,
          password: vars.input.password,
          database: vars.datname,
        });
        const tables =
          await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'`;
        console.log("===== db connected === ", tables);
        return { data:"Successfully logged in", error: null };
      } catch (error: any) {
        console.log(" ==== error logging into DB === ", error.message);
        return { data:undefined,error: error.message };
      }
    },
  );

  const mutation_error = mutation.data?.error;
    const page_ctx = usePageContext();
    const db_page_url = new URL(page_ctx.url);
  useEffect(() => {
    if (isString(mutation_error) && mutation.isError) {
      hotToast({
        title: "Error",
        description: mutation_error,
        type: "error",
      })
    }
    if (mutation.isSuccess) {
      hotToast({
        title: "Success",
        description: mutation.data?.data ?? "",
        type: "success",
      });
        db_page_url.pathname = `/pg/db/${datname}`;
        db_page_url.searchParams.set("name", input.user);
        db_page_url.searchParams.set("password", input.password);
      navigate(db_page_url.toString());
    }
  }, [mutation]);

return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex items-center justify-center bg-base-200 hover:bg-base-300 py-1 px-2 gap-5 ">
          <div className="text-lg font-bold text-center">{datname}</div>
          <ChevronRightSquare />
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
          {/* <Link
            href={db_page_url.toString()}
            className=" rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 "
          >
            continue
          </Link> */}
          <Button
            className="rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 
            flex gap-4 place-content-center"
            disabled={!isString(input.user) || !isString(input.password) || mutation.isLoading}
            onClick={() => {
              if (isString(input.user) || isString(input.password)) {
                mutation.mutate({ datname, input });
              }
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

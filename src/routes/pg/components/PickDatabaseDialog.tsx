import { Button } from "@/components/shadcn/ui/button";
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
import { Link, usePageContext } from "rakkasjs";
import { useState } from "react";
import { UserCombobox } from "./UserCombobox";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn/ui/alert";

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
  const page_ctx = usePageContext()
  const db_page_url = new URL(page_ctx.url)
  db_page_url.pathname = `/pg/db/${datname}`
  db_page_url.searchParams.set('name',input.user)
  db_page_url.searchParams.set('password',input.password)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{datname}</DialogTitle>
          <DialogDescription>
         
            <Alert>
              <AlertTitle>Hint</AlertTitle>
              <AlertDescription>
                password default is usually 'postgres'
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center  gap-4 py-4">
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

          <div className="flex flex-col  gap-1">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input
              id="password"
              value={input.password}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Link
            href={db_page_url.toString()}
            className=" rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 "
          >
            continue
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

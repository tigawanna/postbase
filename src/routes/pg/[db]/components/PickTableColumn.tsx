import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
  import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { ChevronRightCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { navigate, usePageContext } from "rakkasjs";
import { Button } from "@/components/shadcn/ui/button";

interface PickTableColumnProps {
  db_name: string;
  table_name: string;
  columns:string[]
}

export function PickTableColumnDialog({columns,db_name,table_name}: PickTableColumnProps) {
  const page_ctx = usePageContext();
  const table_url = page_ctx.url;
const [checked_column,setColumn]=useState(columns[0])

useEffect(() => {
table_url.searchParams.set("column", checked_column);
}, [checked_column]);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <ChevronRightCircle />

        {/* <Button variant="outline">Open</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{table_name}</DialogTitle>

          <DialogDescription className="brightness-75">
            Pick a column that will be used as the primary key and pagination
            cursor , Primary id or create a are the most commonly used for this
          </DialogDescription>
        </DialogHeader>

        <ul className="divide-y flex flex-col gap-3 ">
          {columns.map((column) => {
            return (
              <li className="flex gap-3 " key={column}>
                <Checkbox
                  id="column"
                  className="h-6 w-6"
                  //   onCheckedChange={(e) => console.log("e == ", e)}
                  onCheckedChange={(e) => setColumn(column)}
                  checked={column === checked_column}
                />
                <label
                  htmlFor="column"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column}
                </label>
              </li>
            );
          })}
        </ul>
        <DialogFooter>
          <Button
            onClick={() => {
              table_url.pathname = `/pg/${db_name}/${table_name}`;
              table_url.searchParams.set("column", checked_column);
              navigate(table_url.toString());
            }}
            className=" rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 "
          >
            continue to {table_name}
          </Button>
          {/* <Link
            href={table_url.toString()}
            className=" rounded-lg px-5 py-1.5 bg-base-200 hover:bg-base-300 hover:text-sky-400 "
          >
            continue to {table_name}
          </Link> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import * as React from "react";
import { cn } from "@/components/shadcn/lib/utils";
import { Button } from "@/components/shadcn/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/shadcn/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Check, ChevronDown } from "lucide-react";



interface UserComboboxProps {
  users:[{usename: string;}]
  value:string;
  setValue(value: string): void
}
export function UserCombobox({users,value,setValue}: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
const db_users = users.map((user)=>{
    return {
        value:user.usename,
        label:user.usename
    }
})

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? db_users.find((db_user) => db_user.value === value)?.label
            : "Select db_user..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search db_user..." className="h-9" />
          <CommandEmpty>No db_user found.</CommandEmpty>
          <CommandGroup>
            {db_users.map((db_user) => (
              <CommandItem
                key={db_user.value}
                value={db_user.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {db_user.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === db_user.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

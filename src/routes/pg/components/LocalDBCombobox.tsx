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

interface LocalDBComboboxProps {
  dbs: [
    {
      datname: string;
    },
  ];
  value: string;
  setValue(value: string): void;
}
export function LocalDBCombobox({
  dbs,
  value,
  setValue,
}: LocalDBComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [, startTransition] = React.useTransition();
  //   const [value, setValue] = React.useState("");
  const db_names = dbs.map((db) => {
    return {
      value: db.datname,
      label: db.datname,
    };
  });

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
            ? db_names.find((db_name) => db_name.value === value)?.label
            : "Select db_name..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search db_name..." className="h-9" />
          <CommandEmpty>No dbs found.</CommandEmpty>
          <CommandGroup>
            {db_names.map((db_name) => (
              <CommandItem
                key={db_name.value}
                value={db_name.value}
                onSelect={(currentValue) => {
                  startTransition(() => setValue(currentValue));
                  setOpen(false);
                }}
              >
                {db_name.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === db_name.value ? "opacity-100" : "opacity-0",
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

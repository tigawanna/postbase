import { useState } from "react";
import {
  Avatar,
  AvatarFallback,

} from "@/components/shadcn/ui/avatar";
import { Button } from "@/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";


interface MiniSettingsModalProps {}

export function MiniSettingsModal({}: MiniSettingsModalProps) {


  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu modal open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button  className="relative h-7 w-7 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={user?.avatar} alt="@shadcn" /> */}
            <AvatarFallback>{"OP"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 " align="end" forceMount>
        <DropdownMenuSeparator />



        <DropdownMenuSeparator />
        {/* theme toggle */}
        <ThemeToggle />
        <DropdownMenuSeparator />
        {/* logout button */}
   
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

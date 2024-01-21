import { useEffect, useState } from "react";
import { Button } from "../shadcn/ui/button";
import { twMerge } from "tailwind-merge";

interface CopyProps {
  text: string;
  className?: string
}

export function CopyToClipBoard({ text,className }: CopyProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyToClipBoard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.log("Error copying to clipboard: ", error);
      });
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);
const button_styles = copied
  ? "glass animate-in fade-in zoom-in"
  : "animate-in fade-in zoom-in";
  return (
    <Button 
    className={twMerge(button_styles,className)}
    onClick={() => handleCopyToClipBoard(text)}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

import { useState } from "react";
import { cn } from "../util/cn";

type CalcKeyProps = {
  keyValue: string;
  className?: string;
  onClick?: (prev: any) => void;
};

export default function CalcKey({
  keyValue,
  className,
  onClick,
}: CalcKeyProps) {
  return (
    <button
      className={cn(
        `flex items-center justify-center hover:bg-gray-300 border border-gray-400 active:bg-gray-400 m-1 shadow-md rounded-sm`,
        className
      )}
      onClick={onClick}
    >
      {keyValue}
    </button>
  );
}

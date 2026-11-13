import React from "react";

// Minimal stand-ins for the flowbite-react Button and List components the
// Paleomap Maker used. flowbite-react 0.7 requires React 18, and the portal
// runs React 19, so these keep the same look without the extra dependency.

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm";
  color?: string;
};

export function Button({ className = "", size, color, ...props }: ButtonProps) {
  void size;
  void color;
  return (
    <button
      type="button"
      className={`block rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

function ListRoot({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return <ul className={`list-inside list-disc space-y-1 text-gray-500 ${className}`}>{children}</ul>;
}

function ListItem({ children }: { children?: React.ReactNode }) {
  return <li>{children}</li>;
}

export const List = Object.assign(ListRoot, { Item: ListItem });

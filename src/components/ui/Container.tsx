import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-4 md:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

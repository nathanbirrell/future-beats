import Image from "next/image";
import { ComponentProps } from "react";
import { Logo } from "./Logo";

type Props = Omit<ComponentProps<typeof Logo>, "src" | "alt">;

export const Loading = ({ className = "", ...props }: Props) => {
  return (
    <span className="flex w-full justify-center">
      <Logo
        className={`animate-spin text-base ${className}`}
        // title="Digging more Future Beats..."
        style={{ color: "white" }}
        {...props}
      />
    </span>
  );
};

import { ComponentProps } from "react";
import { ReactComponent as Logo } from "../icons/logo.svg";

type Props = ComponentProps<typeof Logo>;

export const Loading = ({ className = "", ...props }: Props) => {
  return (
    <span className="flex w-full justify-center">
      <Logo
        className={`animate-spin text-base ${className}`}
        title="Digging more Future Beats..."
        {...props}
      />
    </span>
  );
};

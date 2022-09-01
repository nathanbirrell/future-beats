import React, { HTMLProps } from "react";

export const Toggle = ({ children, ...props }: HTMLProps<HTMLInputElement>) => {
  return (
    <label htmlFor={props.id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only peer" value="" {...props} />

        <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>

        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
            props.checked && "bg-gray-600"
          }`}
        ></div>
      </div>
      <span className="ml-3">{children}</span>
    </label>
  );
};

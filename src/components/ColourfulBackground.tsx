import React, { Fragment, useState } from "react";
import "./ColourfulBackground.css";

export const ColourfulBackground = ({
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="colourful-bg">
      <div className={`${loaded ? "hidden" : "bg-fallback"}`}></div>
      {!!props.src && (
        <Fragment>
          <img
            alt="" // Screen reader hidden
            className={`${loaded ? "bg-one" : "hidden"} ${className}`}
            onLoad={() => setLoaded(true)}
            {...props}
          />
          <img
            alt="" // Screen reader hidden
            className={`${loaded ? "bg-two" : "hidden"} ${className}`}
            {...props}
          />
          {/* <img
            alt="" // Screen reader hidden
            className={`bg-three ${className}`}
            {...props}
          /> */}
        </Fragment>
      )}
    </div>
  );
};

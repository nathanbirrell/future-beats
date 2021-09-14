import React, { Fragment, useCallback, useEffect, useState } from "react";
import "./ColourfulBackground.css";

export const ColourfulBackground = ({
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.classList.add("text-white");

    return () => document.body.classList.remove("text-white");
  }, []);

  const onImgLoad = useCallback(() => setLoaded(true), [setLoaded]);

  return (
    <div className={`colourful-background ${loaded ? "loaded" : ""}`}>
      <div className="colours"></div>
      {!!props.src && (
        <Fragment>
          <img
            className="image-1"
            alt="" // Screen reader hidden
            onLoad={onImgLoad}
            {...props}
          />
          <img
            className="image-2"
            alt="" // Screen reader hidden
            onLoad={onImgLoad}
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

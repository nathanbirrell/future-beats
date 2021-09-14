import React, { Fragment, useCallback, useEffect, useState } from "react";
import "./ColourfulBackground.css";

export const ColourfulBackground = ({
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.classList.add("text-white");
    document.body.classList.add("bg-black");

    return () => {
      document.body.classList.remove("text-white");
      document.body.classList.remove("bg-black");
    };
  }, []);

  const onImgLoad = useCallback(() => setLoaded(true), [setLoaded]);

  return (
    <div className={`colourful-background ${loaded ? "loaded" : ""}`}>
      <div className="dark-overlay"></div>
      {!!props.src && (
        <Fragment>
          <img
            className="image image-animated image-1"
            alt="" // Screen reader hidden
            onLoad={onImgLoad}
            {...props}
          />
          <img
            className="image image-animated image-2"
            alt="" // Screen reader hidden
            {...props}
          />
          <img
            className="image image-static"
            alt="" // Screen reader hidden
            {...props}
          />
        </Fragment>
      )}
    </div>
  );
};

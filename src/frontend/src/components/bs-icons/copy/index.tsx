import React, { forwardRef } from "react";
import { ReactComponent } from "./Copy.svg";

export const CopyIcon = forwardRef<
  SVGSVGElement & { className: any },
  React.PropsWithChildren<{ className?: string }>
>((props, ref) => {
  return <ReactComponent ref={ref} {...props} />;
});

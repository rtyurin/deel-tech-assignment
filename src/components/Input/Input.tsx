import React, { ForwardedRef, InputHTMLAttributes } from "react";

export const Input = React.forwardRef(
  (
    { ...rest }: InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return <input ref={ref} {...rest} />;
  },
);

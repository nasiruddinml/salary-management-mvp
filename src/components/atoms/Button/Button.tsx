import React from "react";
import { Button as AntButton } from "antd";
import { IButtonProps } from "src/types";

const Button = ({
  text,
  className,
  type,
  htmlType,
}: IButtonProps): React.ReactElement => (
  // eslint-disable-next-line react/button-has-type
  <AntButton type={type} htmlType={htmlType} className={className}>
    {text}
  </AntButton>
);

export default Button;

export interface IButtonProps {
  text: string;
  className: string;
  type: "text" | "link" | "ghost" | "default" | "primary" | "dashed" | undefined;
  htmlType? : "button" | "submit" | "reset" | undefined;
}

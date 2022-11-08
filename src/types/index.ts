import { Decimal } from "@prisma/client/runtime";

export interface IButtonProps {
  text: string;
  className: string;
  type:
    | "text"
    | "link"
    | "ghost"
    | "default"
    | "primary"
    | "dashed"
    | undefined;
  htmlType?: "button" | "submit" | "reset" | undefined;
}

export interface IEmployee {
  id: string;
  username: string;
  fullName?: string;
  salary?: Decimal;
}

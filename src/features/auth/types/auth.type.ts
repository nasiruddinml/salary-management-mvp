export type LoginCredentials = {
  email: string;
  password: string;
};

export interface ILoginForm {
  // eslint-disable-next-line
  onFinish: (e: any) => void;
  // eslint-disable-next-line
  styles: any;
}

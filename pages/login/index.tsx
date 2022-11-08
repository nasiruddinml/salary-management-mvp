import LoginForm from "@features/auth/components/LoginForm/LoginForm";
import React, { useEffect } from "react";
import { loginThunk } from "@features/auth/redux/auth.slice";
import { useAppDispatch } from "@redux/store";
import styles from "./login.module.less";
import { GetServerSideProps } from "next";
import { getUser } from "@helpers/session.helper";
import { useRouter } from "next/router";

interface ILoginProps {
  login: boolean
}

const Login = ({ login }: ILoginProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (login) {
      router.push('/dashboard');
    }
  }, [login])
  

  /*
   * Handle login after form submission
   */
  // eslint-disable-next-line
  const onFinish = (values: any) => {
    const credentials = {
      email: values.email,
      password: values.password,
    };

    dispatch(loginThunk(credentials));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <h3 className={styles.header}>Login</h3>
          <LoginForm onFinish={onFinish} styles={styles} />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const user = getUser(ctx);
    return {
      props: {
        login: !!user,
      },
    };
};

export default Login;

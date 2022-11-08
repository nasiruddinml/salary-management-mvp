import { GetServerSideProps } from "next";
import { Card } from "antd";
import React, { useEffect } from "react";
import { getUser } from "@helpers/session.helper";
import { useRouter } from "next/router";
import SiderLayout from "src/layouts/SiderLayout/SiderLayout";

interface IEmployeesProps {
  login: boolean;
  employees: [];
  // eslint-disable-next-line
  user: any;
}

const Employees = ({ login, user }: IEmployeesProps): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    if (!login) {
      router.push("/logout");
    }
  }, [login]);

  return (
    <>
      <Card title="Employees List"></Card>
    </>
  );
};

// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const user = getUser(ctx);
  if (!user) {
    return {
      props: {
        login: false,
        user,
      },
    };
  }

  return {
    props: {
      // login: true,
      login: !!(user && user.id),
      user,
    },
  };
};

Employees.getLayout = (page: React.ReactElement) => (
  <SiderLayout>{page}</SiderLayout>
);

export default Employees;

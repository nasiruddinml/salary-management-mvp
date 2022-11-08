import { GetServerSideProps } from "next";
import { Card } from "antd";
import React, { useEffect } from "react";
import { getUser } from "@helpers/session.helper";
import { useRouter } from "next/router";
import SiderLayout from "src/layouts/SiderLayout/SiderLayout";

interface IDashboardProps {
  login: boolean;
  employees: [];
  // eslint-disable-next-line
  user: any;
}

const Dashboard = ({ login, user }: IDashboardProps): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    if (!login) {
      router.push("/logout");
    }
  }, [login]);

  return (
    <>
      <Card title="Welcome to Salary Management MVP"></Card>
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

Dashboard.getLayout = (page: React.ReactElement) => (
  <SiderLayout>{page}</SiderLayout>
);

export default Dashboard;

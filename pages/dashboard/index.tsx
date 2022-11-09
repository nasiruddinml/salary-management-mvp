import UploadCSV from "@components/molecules/UploadCSV/UploadCSV";
import { getUser } from "@helpers/session.helper";
import { Button, Card, Modal } from "antd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SiderLayout from "src/layouts/SiderLayout/SiderLayout";

interface IDashboardProps {
  login: boolean;
  employees: [];
}

const Dashboard = ({ login }: IDashboardProps): React.ReactElement => {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!login) {
      router.push("/logout");
    }
  }, [login]);

  const openUploadModal = (): void => {
    setIsUploadModalOpen(true);
  };

  return (
    <>
      <Card title="Welcome to Salary Management MVP">
        <Button type="primary" onClick={openUploadModal}>
          Upload Employees Information
        </Button>
      </Card>
      <Modal
        title="Upload CSV file"
        centered
        open={isUploadModalOpen}
        onOk={() => setIsUploadModalOpen(false)}
        onCancel={() => setIsUploadModalOpen(false)}
      >
        <UploadCSV />
      </Modal>
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
      },
    };
  }

  return {
    props: {
      login: !!(user && user.id),
    },
  };
};

Dashboard.getLayout = (page: React.ReactElement) => (
  <SiderLayout>{page}</SiderLayout>
);

export default Dashboard;

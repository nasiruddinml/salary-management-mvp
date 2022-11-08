import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Card } from "antd";
import { getUser } from "@helpers/session.helper";
import { useRouter } from "next/router";
import SiderLayout from "src/layouts/SiderLayout/SiderLayout";
import { useAppSelector, useAppDispatch } from "@redux/store";
import { setBackgroundColor } from "@features/settings/redux/settings.slice";

interface ISettingsProps {
  login: boolean;
  // eslint-disable-next-line
  user: any;
}

const Settings = ({ login, user }: ISettingsProps): React.ReactElement => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { backgroundColor } = useAppSelector((state) => ({
    backgroundColor: state.settings.backgroundColor,
  }));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBackgroundColor(e.target.checked ? "dark" : "light"));
  };

  useEffect(() => {
    if (!login) {
      router.push("/logout");
    }
  }, [login]);

  return (
    <>
      <Card title="Settings"></Card>
      <div>
        <div>
          <label htmlFor="background-color">
            Dark Mode:{" "}
            <input
              id="background-color"
              type="checkbox"
              checked={backgroundColor !== "light"}
              onChange={onChange}
            />
          </label>
        </div>
      </div>
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

Settings.getLayout = (page: React.ReactElement) => (
  <SiderLayout>{page}</SiderLayout>
);

export default Settings;

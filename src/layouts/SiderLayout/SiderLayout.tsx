import {
  DesktopOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";

const { Header, Content, Footer } = Layout;

import { useRouter } from "next/router";
import styles from "./sider-layout.module.less";

const SiderLayout = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        collapsedWidth="0"
        onCollapse={(collapse) => setCollapsed(collapse)}
      >
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          activeKey={router.pathname}
          items={[
            {
              key: "dashboard",
              icon: <DesktopOutlined />,
              label: "Dashboard",
              onClick: () => router.push("/dashboard"),
            },
            {
              key: "employees",
              icon: <TeamOutlined />,
              label: "Employees",
              onClick: () => router.push("/employees"),
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: () => router.push("/settings"),
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: () => router.push("/logout"),
            },
          ]}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          className={styles.siteLayoutBackground}
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Salary Management ??2022 Created by Nasir
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SiderLayout;

import React, { useState } from "react";
import { Layout, Menu } from 'antd';
import Sider from "antd/lib/layout/Sider";
import { DesktopOutlined, TeamOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

import styles from "./sider-layout.module.less";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const SiderLayout = ({children}: {children: React.ReactElement}): React.ReactElement => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { isLogin } = useSelector((store: any )=> store.auth);
  console.log(isLogin);
  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DesktopOutlined />,
              label: 'Dashboard',
              onClick: () => router.push('/dashboard')
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Employees',
              onClick: () => router.push('/employees')
            },
            {
              key: '3',
              icon: <SettingOutlined />,
              label: 'Settings',
              onClick: () => router.push('/settings')
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: () => router.push('/logout')
            }
          ]}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: styles.trigger,
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className={styles.siteLayoutBackground}
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Salary Management ©2022 Created by Nasir</Footer>
      </Layout>
    </Layout>
)};

export default SiderLayout;

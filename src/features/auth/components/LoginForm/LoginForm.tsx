import React from "react";
import { Form, Input } from "antd";
import Button from "@components/atoms/Button/Button";
import { ILoginForm } from "@features/auth/types/auth.type";

const LoginForm = ({ onFinish, styles }: ILoginForm): React.ReactElement => (
  <Form layout="vertical" onFinish={onFinish} autoComplete="off">
    <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
    </Form.Item>

    <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
      <Input.Password />
    </Form.Item>
    <Button type="primary" htmlType="submit" className={styles.button} text="Submit" />
  </Form>
);

export default LoginForm;

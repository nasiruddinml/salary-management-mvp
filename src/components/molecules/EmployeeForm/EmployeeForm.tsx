import { Form, Input, Modal } from "antd";
import React from "react";
import { IEmployee } from "../../../types";

interface Values {
  id: string;
  username: string;
  fullName: string;
  salary: string;
}

interface EmpUpdateFormProps {
  empData: IEmployee;
  open: boolean;
  onUpdate: (values: Values) => void;
  onCancel: () => void;
}

const EmpUpdateForm: React.FC<EmpUpdateFormProps> = ({
  empData,
  open,
  onUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Update Employee Data"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onUpdate({ ...values, id: empData.id });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="update_modal"
        initialValues={{
          username: empData?.username ? empData.username : "",
          fullName: empData?.fullName ? empData.fullName : "",
          salary: empData?.salary ? empData.salary : 0,
        }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Please input the username of employee!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="fullName" label="Full Name">
          <Input />
        </Form.Item>

        <Form.Item name="salary" label="Salary">
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmpUpdateForm;

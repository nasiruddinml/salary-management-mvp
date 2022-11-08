import { Form, Input } from "antd";
import React from "react";

interface Values {
  minSalary: number;
  maxSalary: number;
}

interface SalaryRangeFormProps {
  onFormChange: (values: Values) => void;
}

const SalaryRangeForm: React.FC<SalaryRangeFormProps> = ({ onFormChange }) => {
  const [form] = Form.useForm();

  const onSalaryLimitFormChange = async (values: any) => {
    form
      .validateFields()
      .then(async (values) => {
        onFormChange(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Form
      form={form}
      layout="inline"
      name="filter salary"
      onChange={onSalaryLimitFormChange}
      initialValues={{ minSalary: 0 }}
    >
      <Form.Item name="minSalary" label="Minimum Salary">
        <Input type="number" />
      </Form.Item>

      <Form.Item name="maxSalary" label="Max Salary">
        <Input type="number" />
      </Form.Item>
    </Form>
  );
};

export default SalaryRangeForm;

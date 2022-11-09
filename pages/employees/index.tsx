import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EmpUpdateForm from "@components/molecules/EmployeeForm/EmployeeForm";
import SalaryRangeForm from "@components/molecules/EmployeeForm/SalaryRangeForm";
import {
  employeesApi,
  employeesDeleteApi,
  employeesUpdate,
} from "@features/employees/api/employees.api";
import { getUser } from "@helpers/session.helper";
import { Card, Divider, message, Popconfirm, Table } from "antd";
import { debounce } from "lodash";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SiderLayout from "src/layouts/SiderLayout/SiderLayout";
import { IEmployee } from "../../src/types";

interface IEmployeesProps {
  login: boolean;
  employees: {
    data: any[];
    page: {
      currentPage: number;
      total: number;
      count: number;
    };
  };
}

interface IEmployeesData {
  data: any[];
  page: {
    currentPage: number;
    total: number;
    count: number;
  };
}

interface ITableQueries {
  minSalary: any;
  maxSalary: any;
  limit: any;
  page: any;
  sortField: string | null;
  sort: string | null;
}

const Employees = ({
  login,
  employees,
}: IEmployeesProps): React.ReactElement => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [tableQueries, setTableQueries] = useState<ITableQueries>({
    minSalary: 0,
    maxSalary: null,
    sortField: "id",
    sort: "ascend",
    page: 1,
    limit: 5,
  });
  const [empData, setEmpData] = useState<IEmployeesData>(employees);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [empUpdateExistData, setEmpUpdateExistData] = useState<IEmployee>({
    id: "",
    username: "",
    fullName: "",
  });

  useEffect(() => {
    if (!login) {
      router.push("/logout");
    }
  }, [login]);

  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const getEmployeesList = async (queries: ITableQueries) => {
    try {
      setLoading(true);

      const employeesRes = await employeesApi({
        params: queries,
      });

      if (employeesRes.status === 200) {
        setEmpData({
          data: employeesRes?.data?.data,
          page: employeesRes?.data?.page,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Some Thing went wrong!");
    }
  };

  const deleteEmployeeAction = async (empId: string) => {
    // Call Delete API
    setLoading(true);
    const res = await employeesDeleteApi(empId);
    if (res.status === 204) {
      message.success("Deleted!!");
      setTableQueries((prevState) => {
        return {
          ...prevState,
          currentPage: 1,
          pageSize: 5,
        };
      });
      await getEmployeesList({ ...tableQueries, page: 1 });
    } else {
      message.error(res?.data?.message);
    }
  };

  const onEmpUpdate = async (values: any) => {
    await employeesUpdate(values.id, {
      username: values.username,
      fullName: values.fullName,
      salary: values.salary,
    })
      .then((res) => {
        setUpdateFormOpen(false);
        if (res.status === 202) {
          message.success("Updated");
          getEmployeesList(tableQueries);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message ?? "Something went wrong");
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: {
        compare: (a: any, b: any) => a.id - b.id,
      },
    },
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
      sorter: {
        compare: (a: any, b: any) => a.username.localeCompare(b.username),
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: {
        compare: (a: any, b: any) => a.salary - b.salary,
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      sorter: {
        compare: (a: any, b: any) => a.salary - b.salary,
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, emp: IEmployee) => (
        <>
          <EditOutlined
            onClick={() => openUpdateFormModal(emp)}
            style={{
              cursor: "pointer",
              marginRight: "20px",
            }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteEmployeeAction(emp.id)}
            onCancel={() => null}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              onClick={() => null}
              style={{
                cursor: "pointer",
                color: "red",
              }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  const openUpdateFormModal = async (existingData: IEmployee) => {
    setEmpUpdateExistData(existingData);
    setUpdateFormOpen(true);
  };

  const onChangeTableFilter = async (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setTableQueries((prevState) => {
      return {
        ...prevState,
        sortField: sorter && sorter.field ? sorter.field : "id",
        sort: sorter && sorter.order ? sorter.order : "ascend",
        page: pagination.current ? pagination.current : 1,
        limit: pagination.pageSize,
      };
    });
    await getEmployeesList({
      ...tableQueries,
      page: pagination.current,
      limit: pagination.pageSize,
      sortField: sorter && sorter.field ? sorter.field : "id",
      sort: sorter && sorter.order ? sorter.order : "ascend",
    });
  };

  const onSalaryLimitFormChange = async (values: any) => {
    setTableQueries((prevState) => {
      return {
        ...prevState,
        minSalary: values.minSalary ? values.minSalary : 0,
        maxSalary: values.maxSalary ? values.maxSalary : null,
      };
    });
    await getEmployeesList({
      ...tableQueries,
      minSalary: values.minSalary ? values.minSalary : 0,
      maxSalary: values.maxSalary ? values.maxSalary : null,
    });
  };

  return (
    <>
      <Card title="Employees List">
        <SalaryRangeForm
          onFormChange={debounce(onSalaryLimitFormChange, 500)}
        />
        <Divider dashed />
        {empData?.data?.length ? (
          <Table
            rowKey="id"
            dataSource={empData.data}
            columns={columns}
            loading={loading}
            className="table-responsive"
            onChange={onChangeTableFilter}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 15],
              defaultPageSize: 5,
              total: empData.page.count,
              current: empData.page.currentPage,
            }}
          />
        ) : (
          <p>No Data Found!!</p>
        )}
        {updateFormOpen ? (
          <EmpUpdateForm
            empData={empUpdateExistData}
            open={updateFormOpen}
            onUpdate={onEmpUpdate}
            onCancel={() => {
              setUpdateFormOpen(false);
            }}
          />
        ) : null}
      </Card>
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
        employees: [],
      },
    };
  }

  let employees = {
    data: [],
    page: {
      currentPage: 1,
      total: 0,
      count: 0,
    },
  };

  try {
    // need to send context ( ctx ) in server calls, so we can access tokens stored in cookies
    const employeesRes = await employeesApi({
      headers: {
        ctx,
      },
    });

    if (employees) {
      employees.data = employeesRes.data.data;
      employees.page.total = employeesRes.data.page.total;
      employees.page.currentPage = employeesRes.data.page.currentPage;
      employees.page.count = employeesRes.data.page.count;
    }
  } catch (err: any) {
    if (err.message === "Operation canceled as no valid access token found.")
      return {
        redirect: {
          destination: "/logout?redirectUrl=dashboard",
          permanent: false,
        },
      };
  }

  return {
    props: {
      login: !!(user && user.id),
      employees,
    },
  };
};

Employees.getLayout = (page: React.ReactElement) => (
  <SiderLayout>{page}</SiderLayout>
);

export default Employees;

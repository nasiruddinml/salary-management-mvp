import { Spin } from 'antd'
import { GetServerSideProps } from 'next'

export default function Home() {
  return (
    <Spin size="large" />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }
}
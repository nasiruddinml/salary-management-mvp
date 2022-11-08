import { Spin } from "antd";
import React from "react";
import styles from "./loader.module.less";

const Loader = (): React.ReactElement => {

  return (
    <>
      <div className={styles.container}>
        <Spin delay={200} size="large" />
      </div>
    </>
  );
};

export default Loader;

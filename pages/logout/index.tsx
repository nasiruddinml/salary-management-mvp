import * as sessionHelper from "@helpers/session.helper";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styles from "./logout.module.less";

const Logout = (): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    sessionHelper.logout();
    router.push("/login");
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoutContainer}>
          <p>...Logging out</p>
        </div>
      </div>
    </>
  );
};

export default Logout;

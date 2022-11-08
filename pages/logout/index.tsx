import React, { useEffect } from "react";
import { useRouter } from "next/router";
import * as sessionHelper from "@helpers/session.helper";

const Logout = (): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    sessionHelper.logout();
    router.push("/login");
  }, []);

  return (
    <>
      <div>...Logging out</div>
    </>
  );
};

export default Logout;

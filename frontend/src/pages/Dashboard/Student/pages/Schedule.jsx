import React from "react";
import styles from "./Schedule.module.scss";

import Layout from "components/Layout/Layout";

const Schedule = () => {
  return (
    <Layout role="student" pageName="Schedule">
      <main className={styles.mainContent}></main>
    </Layout>
  );
};

export default Schedule;

import React from "react";
import styles from "./Finance.module.scss";

import Layout from "components/Layout/Layout";

const Finance = () => {

  return (
    <Layout role="student" pageName="Finance">
      <main className={styles.mainContent}></main>
    </Layout>
  )
}

export default Finance;
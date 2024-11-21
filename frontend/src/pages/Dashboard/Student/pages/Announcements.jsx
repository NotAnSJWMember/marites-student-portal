import React from "react";
import styles from "./Announcements.module.scss";

import Layout from "components/Layout/Layout";

const Announcements = () => {
  return (
    <Layout role="student" pageName="Announcements">
      <main className={styles.mainContent}>
        <section className={styles.emptyContent}>
          <div className={styles.info}>
            <h1 className={styles.title}>Page unavailable</h1>
            <p className={styles.desc}>
              This page hasn't been given enough time yet to be created.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Announcements;

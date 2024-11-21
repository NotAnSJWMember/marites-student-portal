import React from "react";
import styles from "./Examboard.module.scss";

import Layout from "components/Layout/Layout";

const Examboard = () => {
  return (
    <Layout role="student" pageName="Examboard">
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

export default Examboard;

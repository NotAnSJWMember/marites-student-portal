import React from "react";
import styles from "./Home.module.scss";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Homepage | Dr. AMMC</title>
      </Helmet>
      <section className={styles.content}>
        <div>
          <h1 className={styles.code}>Homepage is currently not available.</h1>
        </div>
        <p className={styles.message}>
          For now please continue to the login page of the school's portal.
        </p>
        <button type="button" className={styles.primaryBtn} onClick={() => navigate("/login")}>
          Go to login
        </button>
      </section>
    </div>
  );
};

export default Home;

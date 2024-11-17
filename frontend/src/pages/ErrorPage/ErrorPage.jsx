import React from "react";
import styles from "./ErrorPage.module.scss";
import { Helmet } from "react-helmet-async";

const ErrorPage = ({ errorCode }) => {
  const snapBackToReality = () => {
    window.history.back();
  };

  let label = "";
  let message = "";

  switch (errorCode) {
    case 401:
      label = "You are not authorized to view this page. Please log in.";
      break;
    case 403:
      label = "You do not have permission to access this page.";
      break;
    case 500:
      label = "Oops, something went wrong on our end. Please try again later.";
      break;
    case 400:
      label = "Bad request. Please check the URL or form data.";
      break;
    case 404:
    default:
      label = "Page not found";
      message = `Looks like you traveled to the future and saw that this page could have existed. I'm gonna hold your hand when I say this.. it isn't.`;
  }

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>{`${errorCode} | Dr. AMMC`}</title>
      </Helmet>
      <section className={styles.content}>
        <div>
          <h1 className={styles.code}>{errorCode}</h1>
          <h2 className={styles.label}>{label} :(</h2>
        </div>
        <p className={styles.message}>{message}</p>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => snapBackToReality()}
        >
          Snap back to reality
        </button>
      </section>
    </div>
  );
};

export default ErrorPage;

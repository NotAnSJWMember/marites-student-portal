import React from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./AcademicPlanner.module.scss";
import { TbCertificate2, TbNotes, TbSchool, TbUserPlus } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const AcademicPlanner = () => {
  const { data: courses } = useFetchData("course");
  const { data: programs } = useFetchData("program");
  const { data: curriculums } = useFetchData("curriculum");

  return (
    <Layout role="admin" pageName="Academic Planner">
      <main className={styles.mainContent}>
        <div className={styles.overviewContainer}>
          <a
            href="/admin/dashboard/academic-planner/enrollment"
            className={styles.overviewCard}
          >
            <div className={`${styles.flexContainer} ${styles.enrollmentContainer}`}>
              <div className={styles.iconBtn}>
                <TbUserPlus size={IconSizes.LARGE} />
              </div>
              <div>
                <h2>Enrollment</h2>
                <p>Manage student enrollment for courses</p>
              </div>
            </div>
          </a>
          <a href="/admin/dashboard/academic-planner/courses" className={styles.overviewCard}>
            <div className={styles.flexContainer}>
              <div className={styles.iconBtn}>
                <TbSchool size={IconSizes.LARGE} />
              </div>
              <div>
                <h2>{courses.length}</h2>
                <p>Courses</p>
              </div>
            </div>
            <div className={styles.line}></div>
            <p>Check and customize course details</p>
          </a>
          <a href="/admin/dashboard/academic-planner/programs" className={styles.overviewCard}>
            <div className={styles.flexContainer}>
              <div className={styles.iconBtn}>
                <TbCertificate2 size={IconSizes.LARGE} />
              </div>
              <div>
                <h2>{programs.length}</h2>
                <p>Programs</p>
              </div>
            </div>
            <div className={styles.line}></div>
            <p>View and make changes to the program</p>
          </a>
          <a
            href="/admin/dashboard/academic-planner/curriculums"
            className={styles.overviewCard}
          >
            <div className={styles.flexContainer}>
              <div className={styles.iconBtn}>
                <TbNotes size={IconSizes.LARGE} />
              </div>
              <div>
                <h2>{curriculums.length}</h2>
                <p>Curriculums</p>
              </div>
            </div>
            <div className={styles.line}></div>
            <p>Review and edit curriculum options</p>
          </a>
        </div>
      </main>
    </Layout>
  );
};

export default AcademicPlanner;

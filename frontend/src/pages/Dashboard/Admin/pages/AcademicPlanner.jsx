import React from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./AcademicPlanner.module.scss";
import { TbCertificate2, TbNotes, TbSchool } from "react-icons/tb";

const LARGE_ICON_SIZE = 50;

const AcademicPlanner = () => {
   const token = localStorage.getItem("token");
   const { data: courses } = useFetchData("course", token);
   const { data: programs } = useFetchData("program", token);
   const { data: curriculums }

   return (
      <Layout role="admin" pageName="Academic Planner">
         <main className={styles.mainContent}>
            <section className={styles.overviewContainer}>
               <div className={styles.overviewCard}>
                  <TbSchool size={LARGE_ICON_SIZE} />

                  <h2>Courses</h2>
               </div>
               <div className={styles.overviewCard}>
                  <TbCertificate2 size={LARGE_ICON_SIZE} />
                  <h2>Programs</h2>
               </div>
               <div className={styles.overviewCard}>
                  <TbNotes size={LARGE_ICON_SIZE} />
                  <h2>Curriculums</h2>
               </div>
            </section>
         </main>
      </Layout>
   );
};

export default AcademicPlanner;

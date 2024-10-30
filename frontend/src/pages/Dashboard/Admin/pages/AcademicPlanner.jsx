import React from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./AcademicPlanner.module.scss";
import {
   TbArrowNarrowRight,
   TbCertificate2,
   TbNotes,
   TbSchool,
} from "react-icons/tb";
import SearchBar from "components/SearchBar/SearchBar";

const LARGE_ICON_SIZE = 26;
const SMALL_ICON_SIZE = 20;

const AcademicPlanner = () => {
   const token = localStorage.getItem("token");
   const { data: courses } = useFetchData("course", token);
   const { data: programs } = useFetchData("program", token);
   const { data: curriculums } = useFetchData("curriculum", token);

   const stats = {
      totalStudents: 1200,
      averageCompletionRate: "85%",
      enrolledPerProgram: 400,
   };

   return (
      <Layout role="admin" pageName="Academic Planner">
         <main className={styles.mainContent}>
            <section className={styles.overviewContainer}>
               <a
                  href="/admin/dashboard/academic-planner/courses"
                  className={styles.overviewCard}
               >
                  <div className={styles.flexContainer}>
                     <div className={styles.iconBtn}>
                        <TbSchool size={LARGE_ICON_SIZE} />
                     </div>
                     <div>
                        <h2>{courses.length}</h2>
                        <p>Courses</p>
                     </div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.cta}>
                     <p>Check and customize course details</p>
                     <TbArrowNarrowRight
                        size={SMALL_ICON_SIZE}
                        style={{ justifySelf: "self-end" }}
                     />
                  </div>
               </a>
               <a
                  href="/admin/dashboard/academic-planner/programs"
                  className={styles.overviewCard}
               >
                  <div className={styles.flexContainer}>
                     <div className={styles.iconBtn}>
                        <TbCertificate2 size={LARGE_ICON_SIZE} />
                     </div>
                     <div>
                        <h2>{programs.length}</h2>
                        <p>Programs</p>
                     </div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.cta}>
                     <p>View and make changes to the program</p>
                     <TbArrowNarrowRight
                        size={SMALL_ICON_SIZE}
                        style={{ justifySelf: "self-end" }}
                     />
                  </div>
               </a>
               <a
                  href="/admin/dashboard/academic-planner/curriculums"
                  className={styles.overviewCard}
               >
                  <div className={styles.flexContainer}>
                     <div className={styles.iconBtn}>
                        <TbNotes size={LARGE_ICON_SIZE} />
                     </div>
                     <div>
                        <h2>{curriculums.length}</h2>
                        <p>Curriculums</p>
                     </div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.cta}>
                     <p>Review and edit curriculum options</p>
                     <TbArrowNarrowRight
                        size={SMALL_ICON_SIZE}
                        style={{ justifySelf: "self-end" }}
                     />
                  </div>
               </a>
            </section>
            <section>
               <SearchBar width="100%" />
            </section>
            <div className={styles.twoColumn}>
               <section className={styles.semesterSummary}>
                  <div className={styles.semesterTitle}>
                     <h2>Semester Overview</h2>
                     <p>Check the details of the current semester</p>
                  </div>
                  <div className={styles.line}></div>
                  <div className={`${styles.semesterCard} ${styles.twoColumn}`}>
                     <div>
                        <h4 className={styles.badge}>Timeframe</h4>
                     </div>
                     <div className={styles.semesterDates}>
                        <div>
                           <h4>May 23, 2024</h4>
                           <p>Start Date</p>
                        </div>
                        <div>
                           <h4>September 10, 2024</h4>
                           <p>End Date</p>
                        </div>
                     </div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={`${styles.semesterCard} ${styles.twoColumn}`}>
                     <div>
                        <h4 className={styles.badge}>Examination</h4>
                     </div>
                     <div className={styles.semesterDates}>
                        <div>
                           <h4>March 19, 2019</h4>
                           <p>Midterms Date</p>
                        </div>
                        <div>
                           <h4>May 19, 2024</h4>
                           <p>Finals Date</p>
                        </div>
                     </div>
                  </div>
               </section>
               <section className={styles.overviewCard}>
                  <div className={styles.flexContainer}>
                     <div>
                        <h2>{stats.totalStudents}</h2>
                        <p>Students Enrolled</p>
                     </div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.cta}>
                     <p>Avg Completion Rate: {stats.averageCompletionRate}</p>
                     <p>Enrolled Per Program: {stats.enrolledPerProgram}</p>
                  </div>
               </section>
            </div>
         </main>
      </Layout>
   );
};

export default AcademicPlanner;

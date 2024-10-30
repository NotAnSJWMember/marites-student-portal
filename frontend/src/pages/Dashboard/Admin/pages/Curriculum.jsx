import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./Curriculum.module.scss";
import { TbArrowNarrowLeft } from "react-icons/tb";

const Curriculum = () => {
   const [selectedProgram, setSelectedProgram] = useState(null);

   const token = localStorage.getItem("token");
   const { data: programs, loading, error } = useFetchData("program", token);

   const handleSelectProgram = (event) => {
      const key = event.currentTarget.getAttribute("data-code");
      setSelectedProgram(key);
   };

   return (
      <Layout role="admin" pageName="Curriculum">
         <div className={styles.mainContent}>
            <section className={styles.selectProgram}>
               <div className={styles.iconLabel}>
                  <TbArrowNarrowLeft size={24} />
                  <p>Return to page</p>
               </div>
               <div className={styles.info}>
                  <h2 className={styles.title}>Choose a program</h2>
                  <p className={styles.desc}>
                     Since curriculums are predefined to each program, you'll
                     need to select a program to view/edit its curriculum.
                  </p>
               </div>
               <div className={styles.programsList}>
                  {programs.map((program) => (
                     <div
                        className={`${styles.programCard} ${
                           selectedProgram === program.collegeCode
                              ? styles.active
                              : ""
                        }`}
                        onClick={handleSelectProgram}
                        data-code={program.collegeCode}
                        key={program.collegeCode}
                     >
                        <h3>{program.programDescription}</h3>
                        <p className={styles.badge}>{program.collegeCode}</p>
                     </div>
                  ))}
               </div>
               <button
                  type="button"
                  className={`${styles.nextBtn} ${styles.ctaBtn}`}
               >
                  Next step
               </button>
            </section>
         </div>
      </Layout>
   );
};

export default Curriculum;

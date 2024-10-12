import React from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "components/Navbar/Navbar";
import { Header } from "components/Header/Header";

import styles from "./StudentDashboard.module.scss";
import { TbArrowRight, TbCalendar, TbCertificate, TbClock, TbMapPin, TbUser } from "react-icons/tb";

const ICON_SIZE = 24;
const SMALL_ICON_SIZE = 16;

const StudentDashboard = () => {
   return (
      <div>
         <Helmet>
            <title>Student Dashboard | Dr. AMMC</title>
         </Helmet>
         <div className={styles.gridContainer}>
            <Navbar role="student"></Navbar>
            <div className={styles.contentWrapper}>
               <Header></Header>
               <div className={styles.contentDivider}>
                  <div className={styles.mainContent}>
                     <div className={styles.heroWelcome}>
                        <h2>Welcome, Caenar!</h2>
                        <p>12 October 2024, Saturday</p>
                     </div>
                     <div className={styles.heroBanner}>
                        <h2 className={styles.heroBannerTitle}>
                           Join the hackathon today!
                        </h2>
                        <p className={styles.heroBannerDesc}>
                           Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Deserunt id corporis, exercitationem aut
                           numquam possimus. Quo rem optio dolores corrupti.
                        </p>
                        <a href="/" className={styles.ctaBtn}>
                           <button type="button" className={styles.iconBtn}>
                              Learn more <TbArrowRight size={SMALL_ICON_SIZE} />
                           </button>
                        </a>
                     </div>
                     <section>
                        <div className={styles.sectionLabel}>
                           <h2 className={styles.labelText}>
                              <TbCertificate size={ICON_SIZE} />
                              Enrolled Courses
                           </h2>
                           <a
                              href="enrolled-courses"
                              className={styles.iconCta}
                           >
                              View all
                              <TbArrowRight size={SMALL_ICON_SIZE} />
                           </a>
                        </div>
                        <div className={styles.sectionContent}>
                           <div className={styles.courseCard}>
                              <h2>Fundamentals of Programming</h2>
                              <div className={styles.line}></div>
                              <div className={styles.courseInfo}>
                                 <div className={styles.infoItem}>
                                    <TbUser size={ICON_SIZE}/>
                                    <p>Professor pota</p>
                                 </div>
                                 <div className={styles.infoItem}>
                                    <TbCalendar size={ICON_SIZE}/>
                                    <p>Professor pota</p>
                                 </div>
                                 <div className={styles.infoItem}>
                                    <TbClock size={ICON_SIZE}/>
                                    <p>Professor pota</p>
                                 </div>
                                 <div className={styles.infoItem}>
                                    <TbMapPin size={ICON_SIZE}/>
                                    <p>Professor pota</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
                  <div className={styles.sideContent}>side</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default StudentDashboard;

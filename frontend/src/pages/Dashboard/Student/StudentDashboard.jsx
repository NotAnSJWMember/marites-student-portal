import React from "react";
import styles from "./StudentDashboard.module.scss";

import IconSizes from "constants/IconSizes";
import Layout from "components/Layout/Layout";
import CourseCard from "components/CourseCard/CourseCard";
import CalendarCard from "components/Calendar/CalendarCard";

const StudentDashboard = () => {
  return (
    <Layout role="student" pageName="Dashboard">
      <div className={styles.contentDivider}>
        <main className={styles.mainContent}>
          <section className={`${styles.contentCard} ${styles.classes}`}>
            <h2 className={styles.labelText}>Classes Today</h2>
            <div className={`${styles.courseContent}`}>
              <CourseCard
                title="Fundamentals of Programming"
                catalog="CC 101A"
                block="BLOCK A"
                time="8:00am - 9:30am"
                room="319"
                teacher="Aljohn Marilag"
              />
              <CourseCard
                title="Introduction to Computing"
                catalog="CC 100"
                block="BLOCK B"
                time="9:30am - 12:00am"
                room="315"
                teacher="Rhodora Faye"
              />
              <CourseCard
                title="Understanding the Self"
                catalog="GE 01"
                block="BLOCK I"
                time="1:00 pm - 2:30pm"
                room="204"
                teacher="Areth Arana"
              />
            </div>
          </section>
          <section className={`${styles.contentCard} ${styles.announcements}`}>
            <h2 className={styles.labelText}>Announcements</h2>
          </section>
        </main>
        <aside className={styles.sideContent}>
          <section className={styles.calendar}>
            <h2 className={styles.labelText}>Calendar</h2>
            <CalendarCard />
          </section>
          <section className={`${styles.contentCard} ${styles.events}`}>
            <h2 className={styles.labelText}>Events</h2>
            <div className={styles.eventContent}></div>
          </section>
        </aside>
      </div>
    </Layout>
  );
};

export default StudentDashboard;

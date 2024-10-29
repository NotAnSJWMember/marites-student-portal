import React from "react";

import Layout from "components/Layout/Layout";
import CourseCard from "components/CourseCard/CourseCard";
import AnnouncementCard from "components/AnnouncementCard/AnnouncementCard";
import EventCard from "components/EventCard/EventCard";
import CalendarCard from "components/Calendar/CalendarCard";
import AssignmentCard from "components/AssignmentCard/AssignmentCard";

import styles from "./StudentDashboard.module.scss";
import { TbArrowRight } from "react-icons/tb";

const SMALL_ICON_SIZE = 16;

const StudentDashboard = () => {
   return (
      <Layout role="student" pageName="Dashboard">
         <div className={styles.contentDivider}>
            <main className={styles.mainContent}>
               <section className={styles.previewClasses}>
                  <div className={styles.sectionLabel}>
                     <h2 className={styles.labelText}>Classes Today</h2>
                     <a href="enrolled-courses" className={styles.iconCta}>
                        View all
                        <TbArrowRight size={SMALL_ICON_SIZE} />
                     </a>
                  </div>
                  <div className={styles.sectionContent}>
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
               <div className={styles.twoColumn}>
                  <section className={styles.previewEvents}>
                     <div className={styles.sectionLabel}>
                        <h2 className={styles.labelText}>Events</h2>
                        <a href="enrolled-courses" className={styles.iconCta}>
                           View all
                           <TbArrowRight size={SMALL_ICON_SIZE} />
                        </a>
                     </div>
                     <div className={styles.sectionContent}>
                        <EventCard
                           title="Lulu"
                           month="Oct"
                           day="13"
                           desc="Make sure you lulu before the midterm exams to pass!"
                        />
                        <EventCard
                           title="Lulu"
                           month="Oct"
                           day="13"
                           desc="Make sure you lulu before the midterm exams to pass!"
                        />
                        <EventCard
                           title="Lulu"
                           month="Oct"
                           day="13"
                           desc="Make sure you lulu before the midterm exams to pass!"
                        />
                        <EventCard
                           title="Lulu"
                           month="Oct"
                           day="13"
                           desc="Make sure you lulu before the midterm exams to pass!"
                        />
                     </div>
                  </section>
                  <section className={styles.previewAnnouncements}>
                     <div className={styles.sectionLabel}>
                        <h2 className={styles.labelText}>Announcements</h2>
                        <a href="enrolled-courses" className={styles.iconCta}>
                           View all
                           <TbArrowRight size={SMALL_ICON_SIZE} />
                        </a>
                     </div>
                     <div className={styles.sectionContent}>
                        <AnnouncementCard
                           title="Boto mo"
                           date="September 1, 2024"
                           link="html"
                        />
                        <AnnouncementCard
                           title="Boto mo"
                           date="September 1, 2024"
                           link="html"
                        />
                        <AnnouncementCard
                           title="Boto mo"
                           date="September 1, 2024"
                           link="html"
                        />
                        <AnnouncementCard
                           title="Boto mo"
                           date="September 1, 2024"
                           link="html"
                        />
                        <AnnouncementCard
                           title="Boto mo"
                           date="September 1, 2024"
                           link="html"
                        />
                     </div>
                  </section>
               </div>
            </main>
            <aside className={styles.sideContent}>
               <section className={styles.previewSchedule}>
                  <div className={styles.sectionLabel}>
                     <h2 className={styles.labelText}>Calendar</h2>
                     <a href="enrolled-courses" className={styles.iconCta}>
                        View schedule
                        <TbArrowRight size={SMALL_ICON_SIZE} />
                     </a>
                  </div>
                  <CalendarCard />
               </section>
               <section className={styles.previewAssignments}>
                  <div className={styles.sectionLabel}>
                     <h2 className={styles.labelText}>Assignments</h2>
                     <a href="enrolled-courses" className={styles.iconCta}>
                        View all
                        <TbArrowRight size={SMALL_ICON_SIZE} />
                     </a>
                  </div>
                  <div className={styles.sectionContent}>
                     <AssignmentCard
                        name="Fundamentals in Programming"
                        status="Incomplete"
                        desc="Create a website that displays a penis"
                        due="November 1, 2024"
                     />
                     <AssignmentCard
                        name="Fundamentals in Programming"
                        status="Incomplete"
                        desc="Create a website that displays a penis"
                        due="November 1, 2024"
                     />
                     <AssignmentCard
                        name="Fundamentals in Programming"
                        status="Incomplete"
                        desc="Create a website that displays a penis"
                        due="November 1, 2024"
                     />
                  </div>
               </section>
            </aside>
         </div>
      </Layout>
   );
};

export default StudentDashboard;

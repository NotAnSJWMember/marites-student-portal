import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

import logo from "assets/images/logo.png";
import {
   TbBook,
   TbCalendarEvent,
   TbCertificate,
   TbLayoutDashboardFilled,
   TbLogout,
   TbNotebook,
   TbReceipt,
   TbSpeakerphone,
} from "react-icons/tb";

const ICON_SIZE = 26;

export const Navbar = ({ role }) => {
   const [activeTab, setActiveTab] = useState("dashboard");

   const handleTabClick = (tab) => {
      setActiveTab(tab);
   };

   const getNavItems = () => {
      switch (role) {
         case "student":
            return (
               <>
                  <div className={styles.itemContainer}>
                     <Link
                        to="/dashboard"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("dashboard")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "dashboard" ? styles.active : ""
                           }
                        >
                           <TbLayoutDashboardFilled size={ICON_SIZE} />
                           Dashboard
                        </button>
                     </Link>
                  </div>
                  <div className={styles.itemContainer}>
                     <h2 className={styles.itemLabel}>Academic</h2>
                     <Link
                        to="/schedule"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("schedule")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "schedule" ? styles.active : ""
                           }
                        >
                           <TbCalendarEvent size={ICON_SIZE} />
                           Schedule
                        </button>
                     </Link>
                     <Link
                        to="/examboard"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("examboard")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "examboard" ? styles.active : ""
                           }
                        >
                           <TbBook size={ICON_SIZE} />
                           Examboard
                        </button>
                     </Link>
                     <Link
                        to="/assignments"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("assignments")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "assignments" ? styles.active : ""
                           }
                        >
                           <TbNotebook size={ICON_SIZE} />
                           Assignments
                        </button>
                     </Link>
                     <Link
                        to="/enrolled-courses"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("enrolledCourses")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "enrolledCourses"
                                 ? styles.active
                                 : ""
                           }
                        >
                           <TbCertificate size={ICON_SIZE} />
                           Courses
                        </button>
                     </Link>
                  </div>
                  <div className={styles.itemContainer}>
                     <h2 className={styles.itemLabel}>Administrative</h2>
                     <Link
                        to="/finance"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("finance")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "finance" ? styles.active : ""
                           }
                        >
                           <TbReceipt size={ICON_SIZE} />
                           Finance
                        </button>
                     </Link>
                     <Link
                        to="/announcements"
                        className={styles.itemBtn}
                        onClick={() => handleTabClick("announcements")}
                     >
                        <button
                           type="button"
                           className={
                              activeTab === "announcements" ? styles.active : ""
                           }
                        >
                           <TbSpeakerphone size={ICON_SIZE} />
                           Announcements
                        </button>
                     </Link>
                  </div>
               </>
            );
         case "teacher":
            return (
               <>
                  <Link to="/teacher-dashboard">Teacher Dashboard</Link>
                  {/* Add more teacher nav items here */}
               </>
            );
         case "admin":
            return (
               <>
                  <Link to="/admin-dashboard">Admin Dashboard</Link>
                  {/* Add more admin nav items here */}
               </>
            );
         default:
            return null;
      }
   };

   return (
      <nav className={styles.navBar}>
         <div className={styles.sealContainer}>
            <img src={logo} alt="Dr. AMMC Seal" />
            <div className={styles.sealContainerText}>
               <h1>Aurelio Mendoza Memorial College</h1>
               <p>Student Portal</p>
            </div>
         </div>
         {getNavItems()}
         <div className={styles.itemContainer}>
            <Link to="/sign-out" className={styles.itemBtn}>
               <button type="button">
                  <TbLogout size={ICON_SIZE} />
                  Sign out
               </button>
            </Link>
         </div>
      </nav>
   );
};

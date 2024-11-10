import React from "react";
import styles from "./Enrollment.module.scss";
import {
   TbEdit,
   TbFileArrowRight,
   TbPlus,
   TbTrash,
} from "react-icons/tb";
import IconSizes from "constants/IconSizes";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Table from "components/Table/Table";
import useFetchData from "hooks/useFetchData";
import { format } from "date-fns";

const Enrollment = () => {
   const { data: students } = useFetchData("student");
   const { data: enrollments } = useFetchData("enrollment");
   const { data: programs } = useFetchData("program");
   const { data: courses } = useFetchData("course");
   const { data: curriculums } = useFetchData("curriculum");
   const { data: sections } = useFetchData("section");
   const { data: schedules } = useFetchData("schedule");

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const StudentView = () => {
      const headers = ["Name", "Program", "Courses", "Enrolled On"];

      const renderData = (data) => {
         const program = programs.find(
            (program) => program._id === data.programId
         );

         return (
            <>
               <div className={styles.userContainer}>
                  <UserIcon image={data.userPhoto} size={48} />
                  <div className={styles.userInfo}>
                     <h4
                        className={styles.title}
                     >{`${data.firstName} ${data.lastName}`}</h4>
                     <p className={styles.desc}>{data.email}</p>
                  </div>
               </div>
               <p className={styles.role}>
                  {program?.code} {data.yearLevel}
               </p>
               <p className={styles.lastActive}>No courses enrolled</p>
               <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
            </>
         );
      };

      const renderPopupContent = (data) => (
         <div className={styles.popupWrapper}>
            <div className={styles.popupContent}>
               <button type="button" className={styles.iconCta}>
                  <TbEdit size={IconSizes.POPUP} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={IconSizes.POPUP} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={IconSizes.POPUP} />
                  Delete user
               </button>
            </div>
         </div>
      );

      return (
         <Table
            data={students}
            headers={headers}
            content={renderData}
            popupContent={renderPopupContent}
         />
      );
   };

   const CourseView = () => {
      const headers = ["Name", "Program", "Instructor", "Created On"];

      const renderData = (data) => (
         <>
            <div className={styles.userContainer}>
               <UserIcon image={data.userPhoto} size={48} />
               <div className={styles.userInfo}>
                  <h4
                     className={styles.title}
                  >{`${data.firstName} ${data.lastName}`}</h4>
                  <p className={styles.desc}>{data.email}</p>
               </div>
            </div>
            <p className={styles.role}>{data.programId}</p>
            <p className={styles.lastActive}>{data.curriculumId}</p>
            <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
         </>
      );

      const renderPopupContent = (data) => (
         <div className={styles.popupWrapper}>
            <div className={styles.popupContent}>
               <button type="button" className={styles.iconCta}>
                  <TbEdit size={IconSizes.POPUP} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={IconSizes.POPUP} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={IconSizes.POPUP} />
                  Delete user
               </button>
            </div>
         </div>
      );

      return (
         <Table
            data={enrollments}
            headers={headers}
            content={renderData}
            popupContent={renderPopupContent}
         />
      );
   };

   const tabs = [
      { label: "Students", content: <StudentView /> },
      { label: "Courses", content: <CourseView /> },
   ];

   return (
      <Layout role="admin" pageName="Enrollment">
         <main className={styles.mainContent}>
            <div className={styles.header}>
               <h1>Enrollment</h1>
            </div>
            <section className={styles.tableWrapper}>
               <TabMenu tabs={tabs} />
            </section>
         </main>
      </Layout>
   );
};

export default Enrollment;

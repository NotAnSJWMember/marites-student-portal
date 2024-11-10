import React from "react";
import styles from "./Enrollment.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Table from "components/Table/Table";
import useFetchData from "hooks/useFetchData";
import { format } from "date-fns";

const POPUP_ICON_SIZE = 25;

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
         // const programCode = programs.map(
         //    (program) => program._id === data.programId
         // );

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
               <p className={styles.role}>{data.programId}</p>
               <p className={styles.lastActive}>{data.curriculumId}</p>
               <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
            </>
         );
      };

      const renderPopupContent = (data) => (
         <div className={styles.popupWrapper}>
            <div className={styles.popupContent}>
               <button type="button" className={styles.iconCta}>
                  <TbEdit size={POPUP_ICON_SIZE} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={POPUP_ICON_SIZE} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={POPUP_ICON_SIZE} />
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
                  <TbEdit size={POPUP_ICON_SIZE} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={POPUP_ICON_SIZE} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={POPUP_ICON_SIZE} />
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
            <h1>Enrollment</h1>
            <section className={styles.tableWrapper}>
               <TabMenu tabs={tabs} />
            </section>
         </main>
      </Layout>
   );
};

export default Enrollment;

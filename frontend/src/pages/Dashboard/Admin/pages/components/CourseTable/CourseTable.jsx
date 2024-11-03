import React from "react";

import styles from "./CourseTable.module.scss";
import useFetchData from "hooks/useFetchData";

const CourseTable = ({ courses }) => {
   const token = localStorage.getItem("token");
   const { data: courseApi } = useFetchData("course", token);
   const { data: usersApi } = useFetchData("user", token);

   return (
      <div className={styles.table}>
         <div className={styles.header}>
            <h2 className={styles.headerLabel}>Code</h2>
            <h2 className={styles.headerLabel}>Total Unit</h2>
            <h2 className={styles.headerLabel}>Description</h2>
            <h2 className={styles.headerLabel}>Instructor</h2>
            <h2 className={styles.headerLabel}>Lection Hour</h2>
            <h2 className={styles.headerLabel}>Lab Hour</h2>
         </div>
         <div className={styles.content}>
            {courses.map((courseId) => {
               const course = courseApi.find((c) => c.courseId === courseId);
               const instructor = usersApi.find(
                  (u) => u.userId === course.instructorId
               );

               return course && instructor ? (
                  <div key={course.courseCode} className={styles.contentItem}>
                     <p>{course.courseCode}</p>
                     <p>{course.totalUnit}</p>
                     <p>{course.courseDescription}</p>
                     <p>{`${instructor?.firstName} ${instructor?.lastName}`}</p>
                     <p>{course.lecHour}</p>
                     <p>{course.labHour}</p>
                  </div>
               ) : null;
            })}
         </div>
      </div>
   );
};

export default CourseTable;

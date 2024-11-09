import React from "react";
import styles from "./CourseTable.module.scss";

const CourseTable = ({ curriculumData, courses, users }) => {
   return (
      <div className={styles.table}>
         <div className={styles.header}>
            <h2 className={styles.headerLabel}>Code</h2>
            <h2 className={styles.headerLabel}>Total Unit</h2>
            <h2 className={styles.headerLabel}>Description</h2>
            <h2 className={styles.headerLabel}>Instructor</h2>
            <h2 className={styles.headerLabel}>Lecture Hour</h2>
            <h2 className={styles.headerLabel}>Lab Hour</h2>
         </div>
         <div className={styles.content}>
            {curriculumData.map((courseId, index) => {
               const course = courses.find((c) => c._id === courseId);

               const instructor = course
                  ? users.find((u) => u.userId === course.instructorId)
                  : null;

               return course ? (
                  <div
                     key={course.code}
                     className={styles.contentItem}
                     style={{
                        border:
                           index === course.length - 1   
                              ? "none"
                              : "1px solid var(--light-gray-color)",
                     }}
                  >
                     <p>{course.code}</p>
                     <p>{course.totalUnit}</p>
                     <p>{course.description}</p>
                     <p>Instructor</p>
                     {/* <p>{`${instructor.firstName} ${instructor.lastName}`}</p> */}
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

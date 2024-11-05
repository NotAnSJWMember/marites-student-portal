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
            {curriculumData.map((curriculum, curriculumIndex) => {
               return curriculum.courses.map((courseId, index) => {
                  const course = courses.find((c) => c.courseId === courseId);
                  const instructor = course
                     ? users.find((u) => u.userId === course.instructorId)
                     : null;

                  return course && instructor ? (
                     <div
                        key={course.courseCode}
                        className={styles.contentItem}
                        style={{
                           border:
                              index === curriculum.courses.length - 1
                                 ? "none"
                                 : "1px solid var(--light-gray-color)",
                        }}
                     >
                        <p>{course.courseCode}</p>
                        <p>{course.totalUnit}</p>
                        <p>{course.courseDescription}</p>
                        <p>{`${instructor.firstName} ${instructor.lastName}`}</p>
                        <p>{course.lecHour}</p>
                        <p>{course.labHour}</p>
                     </div>
                  ) : null;
               });
            })}
         </div>
      </div>
   );
};

export default CourseTable;

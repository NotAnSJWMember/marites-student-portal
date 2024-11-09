import React from "react";
import styles from "./CourseMapping.module.scss";
import Switch from "components/ui/Switch/Switch";

const CourseMapping = ({
   courses,
   users,
   selectedCourses,
   selectedElectiveCourses,
   handleSwitch,
   isSwitchOn,
   handleSelectCourse,
   isFieldsNotEmpty,
}) => {
   const handleCourseClick = (courseId) => {
      if (isFieldsNotEmpty) handleSelectCourse(courseId);
   };
   const handleSwitchClick = () => {
      if (isFieldsNotEmpty) handleSwitch();
   };

   return (
      <div className={styles.coursesContainer}>
         <div>
            <h2 className={styles.title}>Course mapping</h2>
            <p className={styles.desc}>
               If you want to add elective courses, enable the switch and just
               double click the course card.
            </p>
            <br />
            <div
               className={styles.switchButton}
               style={{
                  cursor: isFieldsNotEmpty ? "pointer" : "not-allowed",
                  opacity: isFieldsNotEmpty ? 1 : 0.5,
               }}
            >
               <Switch
                  checked={isSwitchOn}
                  onChange={handleSwitchClick}
                  style={{
                     cursor: isFieldsNotEmpty ? "pointer" : "not-allowed",
                     opacity: isFieldsNotEmpty ? 1 : 0.5,
                  }}
               />
               <p>Add elective course?</p>
            </div>
         </div>
         {courses.map((course) => {
            const instructor = users.find(
               (user) => user.userId === course.instructorId
            );

            return (
               <div
                  className={`${styles.courseCard} ${
                     selectedCourses.includes(course._id)
                        ? styles.selected
                        : ""
                  } ${
                     selectedElectiveCourses.includes(course._id)
                        ? styles.selectedElective
                        : ""
                  }`}
                  onClick={() => handleCourseClick(course._id)}
                  key={course.courseCode}
                  style={{
                     cursor: isFieldsNotEmpty ? "pointer" : "not-allowed",
                     opacity: isFieldsNotEmpty ? 1 : 0.5,
                  }}
               >
                  <div className={styles.courseTitle}>
                     <h3 className={styles.title}>
                        {course.description}
                     </h3>
                     <p className={styles.badge}>{course.code}</p>
                  </div>
                  <div className={styles.courseInfo}>
                     <div className={styles.line}></div>
                     <p className={styles.instructor}>
                        {instructor
                           ? `${instructor.firstName} ${instructor.lastName}`
                           : "No instructor found"}
                     </p>
                     <div className={styles.courseDetails}>
                        <p>Lab hour: {course.labHour}</p>
                        <p>Lecture hour: {course.lecHour}</p>
                        <p>Total unit: {course.totalUnit}</p>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default CourseMapping;

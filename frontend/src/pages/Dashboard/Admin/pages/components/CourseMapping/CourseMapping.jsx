import React, { useMemo, useState } from "react";
import styles from "./CourseMapping.module.scss";
import Switch from "components/ui/Switch/Switch";
import Pagination from "components/Navigation/Pagination";

const CourseMapping = ({
   courses,
   curriculumExists,
   curriculumData,
   selectedCourses,
   selectedElectiveCourses,
   handleSwitch,
   handleSelectCourse,
   isSwitchOn,
   isFieldsNotEmpty,
}) => {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 19;

   const allCourseIds = useMemo(() => {
      const ids = new Set();
      curriculumData.forEach((curriculum) => {
         curriculum.courses.forEach((id) => ids.add(id));
         curriculum.electiveCourses.forEach((id) => ids.add(id));
      });
      return ids;
   }, [curriculumData]);

   const coursesAvailable = useMemo(
      () => courses.filter((course) => !allCourseIds.has(course._id)),
      [courses, allCourseIds]
   );

   const currentData = useMemo(() => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;

      const data = curriculumExists ? courses : coursesAvailable;
      return data.slice(indexOfFirstItem, indexOfLastItem);
   }, [curriculumExists, courses, coursesAvailable, currentPage, itemsPerPage]);

   const handleCourseClick = (courseId) => {
      if (isFieldsNotEmpty) handleSelectCourse(courseId);
   };

   const handleSwitchClick = () => {
      if (isFieldsNotEmpty) handleSwitch();
   };

   const disabledStyle = {
      cursor: isFieldsNotEmpty ? "pointer" : "not-allowed",
      opacity: isFieldsNotEmpty ? 1 : 0.5,
   };

   return (
      <>
         <div className={styles.coursesContainer}>
            <div>
               <h2 className={styles.title}>Course mapping</h2>
               <p className={styles.desc}>
                  If you want to add elective courses, enable the switch and just double click the
                  course card.
               </p>
               <br />
               <div className={styles.switchButton} style={disabledStyle}>
                  <Switch checked={isSwitchOn} onChange={handleSwitchClick} style={disabledStyle} />
                  <p>Add elective course?</p>
               </div>
            </div>
            {currentData.map((course) => {
               const isSelected = selectedCourses.includes(course._id);
               const isSelectedElective = selectedElectiveCourses.includes(course._id);

               return (
                  <div
                     className={`${styles.courseCard} ${isSelected ? styles.selected : ""} ${
                        isSelectedElective ? styles.selectedElective : ""
                     }`}
                     onClick={() => handleCourseClick(course._id)}
                     key={course.courseCode}
                     style={disabledStyle}
                  >
                     <div className={styles.courseTitle}>
                        <h3 className={styles.title}>{course.description}</h3>
                        <p className={styles.badge}>{course.code}</p>
                     </div>
                     <div className={styles.courseInfo}>
                        <div className={styles.line}></div>
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
         <Pagination
            totalItems={courses.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
         />
      </>
   );
};

export default CourseMapping;

import React, { useState } from "react";
import Loading from "components/Loading/Loading";
import Switch from "components/ui/Switch/Switch";
import { FormSelect } from "components/ui/Form";
import { useForm } from "react-hook-form";
import usePostData from "hooks/usePostData";

import styles from "./CreateCurriculum.module.scss";

const CreateCurriculum = ({
   token,
   users,
   courses,
   selectedProgram,
   programData,
   handleNextStep,
   handlePreviousStep,
}) => {
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [clickCounts, setClickCounts] = useState({});

   const { register, handleSubmit } = useForm();
   const { postData, loading } = usePostData();

   const handleSwitch = () => {
      setIsSwitchOn((prev) => !prev);
      setClickCounts({});
      setSelectedCourses([]);
      setSelectedElectiveCourses([]);
   };

   const handleSelectCourse = (course) => {
      if (!isSwitchOn) {
         setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(course)
               ? prevSelectedCourses.filter((c) => c !== course)
               : [...prevSelectedCourses, course]
         );
         return;
      }

      setClickCounts((prevCounts) => {
         const newCount = (prevCounts[course.courseCode] || 0) + 1;
         const updatedCounts = {
            ...prevCounts,
            [course.courseCode]: newCount % 3,
         };

         if (newCount % 3 === 1) {
            setSelectedCourses((prev) => [...prev, course]);
            setSelectedElectiveCourses((prev) =>
               prev.filter((c) => c !== course)
            );
         } else if (newCount % 3 === 2) {
            setSelectedCourses((prev) => prev.filter((c) => c !== course));
            setSelectedElectiveCourses((prev) => [...prev, course]);
         } else {
            setSelectedCourses((prev) => prev.filter((c) => c !== course));
            setSelectedElectiveCourses((prev) =>
               prev.filter((c) => c !== course)
            );
         }

         return updatedCounts;
      });
   };

   const onCreateSubmit = async (data) => {
      if (selectedCourses.length === 0) {
         return;
      }

      const courseIds = selectedCourses.map((c) => c.courseId);
      const electiveCourseIds = selectedElectiveCourses.map((c) => c.courseId);

      const payload = {
         ...data,
         courses: courseIds,
         electiveCourses: electiveCourseIds,
         programId: selectedProgram.programId,
      };

      await postData(payload, "curriculum", token);
      handleNextStep();
   };

   return (
      <>
         <form
            onSubmit={handleSubmit(onCreateSubmit)}
            className={styles.formContainer}
         >
            <div className={styles.twoColumn}>
               <h2>Year Level</h2>
               <FormSelect
                  register={register}
                  name="year"
                  value="yearLevel"
                  options={Array.from(
                     { length: programData.duration },
                     (_, index) => ({
                        value: index + 1,
                        label: `Year ${index + 1}`,
                     })
                  )}
               />
            </div>
            <div className={styles.line}></div>
            <div className={styles.twoColumn}>
               <h2>Semester</h2>
               <FormSelect
                  register={register}
                  name="semester"
                  value="semester"
                  options={[
                     { value: "1", label: "1st Semester" },
                     { value: "2", label: "2nd Semester" },
                  ]}
               />
            </div>
            <div className={styles.line}></div>
            <div className={styles.coursesContainer}>
               <div>
                  <h2 className={styles.title}>Course mapping</h2>
                  <p className={styles.desc}>
                     If you want to add elective courses, enable the switch and
                     just double click the course card.
                  </p>
                  <br />
                  <div className={styles.switchButton}>
                     <Switch checked={isSwitchOn} onChange={handleSwitch} />
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
                           selectedCourses.includes(course)
                              ? styles.selected
                              : ""
                        } ${
                           selectedElectiveCourses.includes(course)
                              ? styles.selectedElective
                              : ""
                        }
      `}
                        onClick={() => handleSelectCourse(course)}
                        key={course.courseCode}
                     >
                        <div className={styles.courseTitle}>
                           <div>
                              <h3 className={styles.title}>
                                 {course.courseDescription}
                              </h3>
                           </div>
                           <p className={styles.badge}>{course.courseCode}</p>
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
            <div className={styles.buttonContainer}>
               <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={styles.secondaryBtn}
               >
                  Previous step
               </button>
               <button
                  type="button"
                  onClick={handleSubmit(onCreateSubmit)}
                  className={styles.primaryBtn}
               >
                  Create curriculum {loading && <Loading />}
               </button>
            </div>
         </form>
      </>
   );
};

export default CreateCurriculum;

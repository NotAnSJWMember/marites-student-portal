import React, { useEffect, useState } from "react";
import Loading from "components/Loading/Loading";
import Switch from "components/ui/Switch/Switch";
import { FormSelect } from "components/ui/Form";
import { useForm } from "react-hook-form";
import usePostData from "hooks/usePostData";

import styles from "./EditCurriculum.module.scss";
import { MessageInfo } from "components/ui/Message/MessageInfo";
import { MessageWarning } from "components/ui/Message/MessageWarning";

const EditCurriculum = ({
   token,
   users,
   courses,
   curriculums,
   selectedProgram,
   programData,
   handleNextStep,
   handlePreviousStep,
}) => {
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [, setClickCounts] = useState({});
   const [curriculumExists, setCurriculumExists] = useState(false);

   const { register, handleSubmit, watch } = useForm({
      defaultValues: {
         yearLevel: "",
         semester: "",
      },
   });
   const { postData, loading } = usePostData();

   const yearLevel = watch("yearLevel");
   const semester = watch("semester");

   useEffect(() => {
      const exists = curriculums.some(
         (curriculum) =>
            curriculum.yearLevel === parseInt(yearLevel) &&
            curriculum.semester === semester
      );
      setCurriculumExists(exists);
      if (exists) {
         const curriculum = curriculums.find(
            (curriculum) =>
               curriculum.yearLevel === parseInt(yearLevel) &&
               curriculum.semester === semester
         );

         if (curriculum) {
            setSelectedCourses(curriculum.courses);
            setSelectedElectiveCourses(curriculum.electiveCourses);

            if (selectedElectiveCourses) setIsSwitchOn(true);
         }
      }
   }, [
      yearLevel,
      semester,
      curriculums,
      setSelectedCourses,
      setSelectedElectiveCourses,
      setIsSwitchOn,
      selectedElectiveCourses,
   ]);

   const handleSwitch = () => {
      setIsSwitchOn((prev) => !prev);
      setClickCounts({});
      setSelectedCourses([]);
      setSelectedElectiveCourses([]);
   };

   const handleSelectCourse = (courseId) => {
      if (!isSwitchOn) {
         setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(courseId)
               ? prevSelectedCourses.filter((c) => c !== courseId)
               : [...prevSelectedCourses, courseId]
         );
      } else {
         setClickCounts((prevCounts) => {
            const newCount = (prevCounts[courseId] || 0) + 1;
            const updatedCounts = {
               ...prevCounts,
               [courseId]: newCount % 3,
            };

            if (newCount % 3 === 1) {
               setSelectedCourses((prev) => [...prev, courseId]);
               setSelectedElectiveCourses((prev) =>
                  prev.filter((c) => c !== courseId)
               );
            } else if (newCount % 3 === 2) {
               setSelectedCourses((prev) => prev.filter((c) => c !== courseId));
               setSelectedElectiveCourses((prev) => [...prev, courseId]);
            } else {
               setSelectedCourses((prev) => prev.filter((c) => c !== courseId));
               setSelectedElectiveCourses((prev) =>
                  prev.filter((c) => c !== courseId)
               );
            }

            return updatedCounts;
         });
      }
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
                  name="yearLevel"
                  value="yearLevel"
                  options={Array.from(
                     { length: programData.duration },
                     (_, index) => ({
                        value: index + 1,
                        label: `Year ${index + 1}`,
                     })
                  )}
                  register={register}
               />
            </div>
            <div className={styles.line}></div>
            <div className={styles.twoColumn}>
               <h2>Semester</h2>
               <FormSelect
                  name="semester"
                  value="semester"
                  options={[
                     { value: "1", label: "1st Semester" },
                     { value: "2", label: "2nd Semester" },
                  ]}
                  register={register}
               />
            </div>
            {yearLevel === "" || semester === "" ? (
               <MessageInfo
                  title="There are empty fields"
                  message="Please choose a valid option for each field."
               />
            ) : (
               !curriculumExists && (
                  <MessageWarning
                     title="This year/semester does not have a curriculum!"
                     message="Please create one for it immediately."
                  />
               )
            )}
            {curriculumExists && (
               <>
                  <div className={styles.line}></div>
                  <div className={styles.coursesContainer}>
                     <div>
                        <h2 className={styles.title}>Course mapping</h2>
                        <p className={styles.desc}>
                           If you want to add elective courses, enable the
                           switch and just double click the course card.
                        </p>
                        <br />
                        <div className={styles.switchButton}>
                           <Switch
                              checked={isSwitchOn}
                              onChange={handleSwitch}
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
                                 selectedCourses.includes(course.courseId)
                                    ? styles.selected
                                    : ""
                              } ${
                                 selectedElectiveCourses.includes(
                                    course.courseId
                                 )
                                    ? styles.selectedElective
                                    : ""
                              }`}
                              onClick={() =>
                                 handleSelectCourse(course.courseId)
                              }
                              key={course.courseCode}
                           >
                              <div className={styles.courseTitle}>
                                 <div>
                                    <h3 className={styles.title}>
                                       {course.courseDescription}
                                    </h3>
                                 </div>
                                 <p className={styles.badge}>
                                    {course.courseCode}
                                 </p>
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
                        Cancel
                     </button>
                     <button
                        type="button"
                        onClick={handleSubmit(onCreateSubmit)}
                        className={styles.primaryBtn}
                     >
                        Save changes {loading && <Loading />}
                     </button>
                  </div>
               </>
            )}
         </form>
      </>
   );
};

export default EditCurriculum;

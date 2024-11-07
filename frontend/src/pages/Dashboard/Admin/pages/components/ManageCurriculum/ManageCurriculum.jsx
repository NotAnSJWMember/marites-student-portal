import React, { useEffect, useState } from "react";
import Loading from "components/Loading/Loading";
import CourseMapping from "../CourseMapping/CourseMapping";
import useUpdateData from "hooks/useUpdateData";
import { FormSelect } from "components/ui/Form";
import { MessageInfo } from "components/ui/Message/MessageInfo";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import { useForm } from "react-hook-form";

import styles from "./EditCurriculum.module.scss";

const EditCurriculum = ({
   token,
   users,
   courses,
   curriculums,
   selectedProgram,
   programData,
   handlePreviousStep,
   onSuccess,
}) => {
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [selectedCurriculum, setSelectedCurriculum] = useState(null);
   const [curriculumExists, setCurriculumExists] = useState(false);
   const [isFieldsNotEmpty, setIsFieldsNotEmpty] = useState(true);
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [, setClickCounts] = useState({});

   const { register, handleSubmit, watch } = useForm({
      defaultValues: {
         yearLevel: "",
         semester: "",
      },
   });

   const { updateData, loading } = useUpdateData();

   const yearLevel = watch("yearLevel");
   const semester = watch("semester");

   const hasElectiveCourses = (curriculum) =>
      curriculum?.electiveCourses?.length > 0;

   useEffect(() => {
      if (selectedCurriculum) {
         setIsSwitchOn(hasElectiveCourses(selectedCurriculum));

         const initialClickCounts = {};

         selectedCurriculum.courses.forEach((courseId) => {
            initialClickCounts[courseId] = 1;
         });

         selectedCurriculum.electiveCourses.forEach((courseId) => {
            initialClickCounts[courseId] = 2;
         });

         setClickCounts(initialClickCounts);
      }
   }, [selectedCurriculum]);

   useEffect(() => {
      if (yearLevel === "" || semester === "") {
         setIsFieldsNotEmpty(false);
      }

      console.log(isFieldsNotEmpty);

      const exists = curriculums.some(
         (curriculum) =>
            curriculum.yearLevel === parseInt(yearLevel) &&
            curriculum.semester === semester
      );

      setCurriculumExists(exists);

      if (exists) {
         setIsFieldsNotEmpty(true);

         const curriculum = curriculums.find(
            (curriculum) =>
               curriculum.yearLevel === parseInt(yearLevel) &&
               curriculum.semester === semester
         );

         if (curriculum) {
            setSelectedCurriculum(curriculum);
            setSelectedCourses(curriculum.courses);
            setSelectedElectiveCourses(curriculum.electiveCourses);
         }
      } else {
         setIsSwitchOn(false);
         setSelectedCourses([]);
         setSelectedElectiveCourses([]);
      }
   }, [yearLevel, semester, curriculums, isFieldsNotEmpty]);

   const handleSwitch = () => {
      setIsSwitchOn((prev) => !prev);
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

   const onSubmit = async (data) => {
      if (selectedCourses.length === 0) {
         return;
      }

      const payload = {
         ...data,
         courses: selectedCourses,
         electiveCourses: selectedElectiveCourses,
         programId: selectedProgram.programId,
      };

      await updateData(payload, "curriculum", selectedCurriculum._id, token);
      onSuccess();
   };

   return (
      <>
         <form
            onSubmit={handleSubmit(onSubmit)}
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
            {!isFieldsNotEmpty ? (
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
            <div className={styles.line}></div>
            <CourseMapping
               courses={courses}
               users={users}
               selectedCourses={selectedCourses}
               selectedElectiveCourses={selectedElectiveCourses}
               handleSwitch={handleSwitch}
               isSwitchOn={isSwitchOn}
               handleSelectCourse={handleSelectCourse}
               isFieldsNotEmpty={isFieldsNotEmpty}
            />
            <div className={styles.buttonContainer}>
               <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={styles.secondaryBtn}
               >
                  Cancel
               </button>
               {isFieldsNotEmpty && (
                  <button
                     type="button"
                     onClick={handleSubmit(onSubmit)}
                     className={styles.primaryBtn}
                  >
                     {curriculumExists ? "Save changes" : "Create curriculum"}
                     {loading && <Loading />}
                  </button>
               )}
            </div>
         </form>
      </>
   );
};

export default EditCurriculum;

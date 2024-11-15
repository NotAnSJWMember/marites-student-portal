import React, { useEffect, useState } from "react";
import CourseMapping from "../CourseMapping/CourseMapping";
import { FormSelect } from "components/ui/Form";
import Loading from "components/Loading/Loading";
import { MessageInfo } from "components/ui/Message/MessageInfo";
import { MessageWarning } from "components/ui/Message/MessageWarning";

import { useForm } from "react-hook-form";
import useUpdateData from "hooks/useUpdateData";
import usePostData from "hooks/usePostData";

import styles from "./ManageCurriculum.module.scss";

const ManageCurriculum = ({
   courses,
   programData,
   curriculumData,
   selectedProgram,
   handlePreviousStep,
   handleSuccess,
   currentMode,
}) => {
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [selectedCurriculum, setSelectedCurriculum] = useState(null);
   const [isFieldsNotEmpty, setIsFieldsNotEmpty] = useState(true);
   const [curriculumExists, setCurriculumExists] = useState(false);
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [, setClickCounts] = useState({});

   const { postData, loading: postLoading } = usePostData();
   const { updateData, loading: updateLoading } = useUpdateData();
   const loading = curriculumExists ? updateLoading : postLoading;

   const { register, handleSubmit, watch } = useForm({
      defaultValues: {
         yearLevel: "",
         semester: "",
      },
   });

   const yearLevel = watch("yearLevel");
   const semester = watch("semester");

   const hasElectiveCourses = (curriculum) => curriculum?.electiveCourses?.length > 0;

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
         setSelectedCurriculum(null);
      } else {
         setIsFieldsNotEmpty(true);

         const exists = curriculumData?.some(
            (curriculum) =>
               curriculum.yearLevel === parseInt(yearLevel) &&
               curriculum.semester === parseInt(semester)
         );

         setCurriculumExists(exists);

         if (exists) {
            const curriculum = curriculumData.find(
               (curriculum) =>
                  curriculum.yearLevel === parseInt(yearLevel) &&
                  curriculum.semester === parseInt(semester)
            );

            if (curriculum) {
               setSelectedCurriculum(curriculum);
               setSelectedCourses(curriculum.courses);
               setSelectedElectiveCourses(curriculum.electiveCourses);
            }
         } else {
            setClickCounts({});
            setSelectedCurriculum(null);
            setSelectedCourses([]);
            setSelectedElectiveCourses([]);
         }
      }
   }, [yearLevel, semester, curriculumData, isFieldsNotEmpty, curriculumExists]);

   const resetElectiveCourses = () => {
      setClickCounts((prevCounts) => {
         const updatedCounts = { ...prevCounts };
         selectedElectiveCourses.forEach((courseId) => {
            delete updatedCounts[courseId];
         });
         return updatedCounts;
      });
      setSelectedElectiveCourses([]);
   };

   const handleSwitch = () => {
      if (isSwitchOn) resetElectiveCourses();
      setIsSwitchOn(!isSwitchOn);
   };

   const handleSelectCourse = (courseId) => {
      setClickCounts((prevCounts) => {
         const newCount = (prevCounts[courseId] || 0) + 1;
         const updatedCounts = {
            ...prevCounts,
            [courseId]: isSwitchOn ? newCount % 3 : 1,
         };

         if (!isSwitchOn) {
            setSelectedCourses((prevSelectedCourses) =>
               prevSelectedCourses.includes(courseId)
                  ? prevSelectedCourses.filter((c) => c !== courseId)
                  : [...prevSelectedCourses, courseId]
            );
         } else {
            if (newCount % 3 === 1) {
               setSelectedCourses((prev) => [...prev, courseId]);
               setSelectedElectiveCourses((prev) => prev.filter((c) => c !== courseId));
            } else if (newCount % 3 === 2) {
               setSelectedCourses((prev) => prev.filter((c) => c !== courseId));
               setSelectedElectiveCourses((prev) => [...prev, courseId]);
            } else {
               setSelectedCourses((prev) => prev.filter((c) => c !== courseId));
               setSelectedElectiveCourses((prev) => prev.filter((c) => c !== courseId));
            }
         }

         return updatedCounts;
      });
   };

   const onSubmit = async (data) => {
      if (selectedCourses.length === 0) {
         return;
      }

      const payload = {
         ...data,
         courses: selectedCourses,
         electiveCourses: selectedElectiveCourses,
         yearLevel: parseInt(data.yearLevel),
         programId: selectedProgram._id,
      };

      if (currentMode === "edit") {
         await updateData(payload, "curriculum", selectedCurriculum._id);
      } else {
         await postData(payload, "curriculum");
      }

      handleSuccess(currentMode);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
         <div className={styles.twoColumn}>
            <h2>Year Level</h2>
            <FormSelect
               name='year'
               value='yearLevel'
               options={Array.from({ length: programData.duration }, (_, index) => ({
                  value: index + 1,
                  label: `Year ${index + 1}`,
               }))}
               register={register}
            />
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h2>Semester</h2>
            <FormSelect
               name='semester'
               value='semester'
               options={[
                  { value: "1", label: "1st Semester" },
                  { value: "2", label: "2nd Semester" },
               ]}
               register={register}
            />
         </div>
         {!isFieldsNotEmpty ? (
            <MessageInfo
               title='There are empty fields'
               message='Please choose a valid option for each field.'
            />
         ) : (
            !curriculumExists && (
               <MessageWarning
                  title='This year/semester does not have a curriculum!'
                  message='Please create one for it immediately.'
               />
            )
         )}
         <div className={styles.line}></div>
         <CourseMapping
            courses={courses}
            curriculumExists={curriculumExists}
            curriculumData={curriculumData}
            selectedCourses={selectedCourses}
            selectedElectiveCourses={selectedElectiveCourses}
            handleSelectCourse={handleSelectCourse}
            handleSwitch={handleSwitch}
            isFieldsNotEmpty={isFieldsNotEmpty}
            isSwitchOn={isSwitchOn}
         />
         <div className={styles.buttonContainer}>
            <button
               type='button'
               onClick={() => handlePreviousStep()}
               className={styles.secondaryBtn}
            >
               Cancel
            </button>
            {isFieldsNotEmpty && (
               <button type='button' onClick={handleSubmit(onSubmit)} className={styles.primaryBtn}>
                  {curriculumExists ? "Save changes" : "Create curriculum"}
                  {loading && <Loading />}
               </button>
            )}
         </div>
      </form>
   );
};

export default ManageCurriculum;

import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./Curriculum.module.scss";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import usePostData from "hooks/usePostData";
import { FormSelect } from "components/ui/Form";
import Switch from "components/ui/Switch/Switch";

const Curriculum = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [programData, setProgramData] = useState(null);
   const [curriculumData, setCurriculumData] = useState(null);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [clickCounts, setClickCounts] = useState({});

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const token = localStorage.getItem("token");
   const { data: programs } = useFetchData("program", token);
   const { data: curriculums } = useFetchData("curriculum", token);
   const { data: courses } = useFetchData("course", token);
   const { data: users } = useFetchData("user", token);

   const { postData, loading, setShowPopup } = usePostData();

   const handleSwitch = () => {
      setIsSwitchOn((prev) => !prev);
      setClickCounts({});
      setSelectedCourses([]);
      setSelectedElectiveCourses([]);
   };
   const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);
   const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);

   const handleSelectProgram = (event) => {
      const key = event.currentTarget.getAttribute("data-code");

      if (selectedProgram === key) {
         setSelectedProgram(null);
         setProgramData(null);
         setCurriculumData(null);
      } else {
         setSelectedProgram(key);

         const programData = programs.find(
            (program) => program.collegeCode === key
         );
         setProgramData(programData);

         const curriculumData = curriculums.find(
            (curriculum) => curriculum._id === programData._id
         );
         setCurriculumData(curriculumData);
      }
   };

   const handleSelectCourse = (course) => {
      if (!isSwitchOn) {
         setSelectedCourses((prevSelectedCourses) => {
            if (prevSelectedCourses.includes(course)) {
               return prevSelectedCourses.filter((c) => c !== course);
            } else {
               return [...prevSelectedCourses, course];
            }
         });
      } else {
         setClickCounts((prevCounts) => {
            const newCount = (prevCounts[course.courseCode] || 0) + 1;

            return {
               ...prevCounts,
               [course.courseCode]: newCount,
            };
         });

         const currentCount = clickCounts[course.courseCode] || 0;

         if (currentCount + 1 === 1) {
            setSelectedCourses((prevSelectedCourses) => [
               ...prevSelectedCourses,
               course,
            ]);
         } else if (currentCount + 1 === 2) {
            setSelectedElectiveCourses((prevSelectedCourses) => [
               ...prevSelectedCourses,
               course,
            ]);
         } else if (currentCount + 1 === 3) {
            setSelectedCourses((prevSelectedCourses) =>
               prevSelectedCourses.filter((c) => c !== course)
            );
            setSelectedElectiveCourses((prevSelectedCourses) =>
               prevSelectedCourses.filter((c) => c !== course)
            );
            setClickCounts((prevCounts) => ({
               ...prevCounts,
               [course.courseCode]: 0,
            }));
            setClickCounts((prevCounts) => {
               const newCount = (prevCounts[course.courseCode] || 0) + 1;

               return {
                  ...prevCounts,
                  [course.courseCode]: newCount,
               };
            });
         }
      }
   };

   const togglePopup = () => setIsPopupVisible(true);
   const closePopup = () => {
      setIsPopupVisible(false);
      setCurrentStep(1);
   };

   const onCreateSubmit = async (data) => {
      const endpoint = "curriculum/create";
      await postData(data, endpoint, token);
      setShowPopup(true);
   };

   return (
      <Layout role="admin" pageName="Curriculum">
         <div className={styles.mainContent}>
            <section className={styles.wrapper}>
               <a href="/admin/dashboard/academic-planner">
                  <div className={styles.iconLabel}>
                     <TbArrowNarrowLeft size={24} />
                     <p>Return to page</p>
                  </div>
               </a>
               {currentStep === 1 && (
                  <>
                     <div className={styles.selectProgram}>
                        <div className={styles.info}>
                           <div>
                              <h2 className={styles.title}>Choose a program</h2>
                              <p className={styles.desc}>
                                 Since curriculums are predefined to each
                                 program, you'll need to select a program to
                                 view/edit its curriculum.
                              </p>
                           </div>
                           {curriculumData === undefined && (
                              <MessageWarning
                                 title="This program does not have a curriculum!"
                                 message="Please create one for it immediately."
                              />
                           )}
                        </div>
                        <div className={styles.programsList}>
                           {programs.map((program) => (
                              <div
                                 className={`${styles.programCard} ${
                                    selectedProgram === program.collegeCode
                                       ? styles.active
                                       : ""
                                 }`}
                                 onClick={handleSelectProgram}
                                 data-code={program.collegeCode}
                                 key={program.collegeCode}
                              >
                                 <h3>{program.programDescription}</h3>
                                 <p className={styles.badge}>
                                    {program.collegeCode}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <button
                        type="button"
                        onClick={handleNextStep}
                        className={`${styles.submitBtn} ${styles.ctaBtn}`}
                     >
                        Next step
                     </button>
                  </>
               )}
               {currentStep === 2 && (
                  <>
                     <div className={styles.programInfo}>
                        <h1>{programData.programDescription}</h1>
                     </div>
                     {curriculumData === undefined && (
                        <form
                           onSubmit={handleSubmit(onCreateSubmit)}
                           className={styles.formContainer}
                        >
                           <div className={styles.twoColumn}>
                              <h2>Year Level</h2>
                              <FormSelect
                                 register={register}
                                 name="Year"
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
                                 name="Semester"
                                 options={[
                                    { value: "1", label: "1st Semester" },
                                    { value: "2", label: "2nd Semester" },
                                 ]}
                              />
                           </div>
                           <div className={styles.line}></div>
                           <div className={styles.coursesContainer}>
                              <div>
                                 <h2 className={styles.title}>
                                    Course mapping
                                 </h2>
                                 <p className={styles.desc}>
                                    If you want to add elective courses, enable
                                    the switch and just double click the course
                                    card.
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
                                    (user) =>
                                       user.userId === course.instructorId
                                 );
                                 return (
                                    <div
                                       className={`${styles.courseCard} ${
                                          selectedCourses.includes(course)
                                             ? styles.selected
                                             : ""
                                       } ${
                                          selectedElectiveCourses.includes(
                                             course
                                          )
                                             ? styles.selectedElective
                                             : ""
                                       }
                                       `}
                                       onClick={() =>
                                          handleSelectCourse(course)
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
                                             <p>
                                                Lecture hour: {course.lecHour}
                                             </p>
                                             <p>
                                                Total unit: {course.totalUnit}
                                             </p>
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
                                 className={styles.submitBtn}
                              >
                                 Create curriculum
                              </button>
                           </div>
                        </form>
                     )}
                  </>
               )}
            </section>
         </div>
      </Layout>
   );
};

export default Curriculum;

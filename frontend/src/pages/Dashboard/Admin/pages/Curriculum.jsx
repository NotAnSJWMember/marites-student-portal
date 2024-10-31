import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import useFetchData from "hooks/useFetchData";

import styles from "./Curriculum.module.scss";
import { TbArrowNarrowLeft } from "react-icons/tb";
import { useForm } from "react-hook-form";
import Popup from "components/Popup/Popup";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import usePostData from "hooks/usePostData";
import { FormInput, FormSelect } from "components/ui/Form";

const Curriculum = () => {
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [programData, setProgramData] = useState(null);
   const [curriculumData, setCurriculumData] = useState(null);
   const [currentStep, setCurrentStep] = useState(1);

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

   const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);
   const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);

   const handleSelectProgram = (event) => {
      const key = event.currentTarget.getAttribute("data-code");
      setSelectedProgram(key);

      const programData = programs.find(
         (program) => program.collegeCode === key
      );
      setProgramData(programData);
      const curriculumData = curriculums.find(
         (curriculum) => curriculum._id === programData._id
      );

      setCurriculumData(curriculumData);
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
               <div className={styles.iconLabel}>
                  <TbArrowNarrowLeft size={24} />
                  <p>Return to page</p>
               </div>
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
                        className={`${styles.nextBtn} ${styles.ctaBtn}`}
                     >
                        Next step
                     </button>
                  </>
               )}
               {currentStep === 2 && (
                  <>
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
                                 <h2>Course mapping</h2>
                                 <button></button>
                              </div>
                              {courses.map((course) => {
                                 const instructor = users.find(
                                    (user) =>
                                       user.userId === course.instructorId
                                 );
                                 return (
                                    <div
                                       className={styles.courseCard}
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

import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import CourseTable from "./components/CourseTable/CourseTable";
import ManageCurriculum from "./components/ManageCurriculum/ManageCurriculum";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import useFetchData from "hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import styles from "./Curriculum.module.scss";
import {
   TbArrowNarrowLeft,
   TbCircleCheckFilled,
   TbEdit,
   TbPlus,
} from "react-icons/tb";

const Curriculum = () => {
   const [successType, setSuccessType] = useState(null);
   const [currentStep, setCurrentStep] = useState(1);
   const [currentMode, setCurrentMode] = useState("base");
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [curriculumData, setCurriculumData] = useState([]);
   const [programData, setProgramData] = useState(null);

   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const { data: programs, loading: loadingPrograms } = useFetchData(
      "program",
      token
   );
   const { data: curriculums, loading: loadingCurriculums } = useFetchData(
      "curriculum",
      token
   );
   const { data: courses, loading: loadingCourses } = useFetchData(
      "course",
      token
   );
   const { data: users, loading: loadingUsers } = useFetchData("user", token);

   const pageLabels = {
      create: "Create Curriculum",
      edit: "Edit Curriculum",
   };

   const handleSelectProgram = (program) => {
      const selectedCurriculum = curriculums.filter(
         (curr) => curr.programId === program._id
      );
      setSelectedProgram(selectedProgram === program ? null : program);
      setProgramData(selectedProgram === program ? null : program);
      setCurriculumData(selectedProgram === program ? [] : selectedCurriculum);
      setCurrentMode(selectedCurriculum.length === 0 ? "create" : "base");
   };

   const handleNextStep = () => setCurrentStep((prev) => prev + 1);
   const handlePreviousStep = () => {
      if (currentStep <= 1)
         return navigate("/admin/dashboard/academic-planner");
      setCurrentStep((prev) => prev - 1);
      if (curriculumData.length !== 0) setCurrentMode("base");
   };

   const handleSuccess = (type) => {
      setSuccessType(type);
      handleNextStep();
   };

   const isLoading =
      loadingPrograms || loadingCurriculums || loadingUsers || loadingCourses;
   if (isLoading) return <Loading />;

   const YearCard = ({ yearIndex }) => (
      <div className={styles.curriculumCard}>
         <div className={styles.yearInfo}>
            <p className={styles.badge}>
               {
                  [
                     "First Year",
                     "Second Year",
                     "Third Year",
                     "Fourth Year",
                     "Fifth Year",
                  ][yearIndex]
               }
            </p>
            <p className={styles.yearDescription}>
               {
                  [
                     "Introduction to foundational subjects and core principles.",
                     "Building on fundamentals with intermediate coursework.",
                     "Advanced topics and specialized courses.",
                     "Practical experience, research, and capstone projects.",
                     "Finalizing expertise and preparing for graduation.",
                  ][yearIndex]
               }
            </p>
         </div>
      </div>
   );

   const CurriculumSection = ({ title, desc, data }) => (
      <div>
         <h2 className={styles.title}>{title}</h2>
         <p className={styles.desc}>{desc}</p>
         <CourseTable curriculumData={data} courses={courses} users={users} />
      </div>
   );

   return (
      <Layout role="admin" pageName="Curriculum">
         <div className={styles.mainContent}>
            <section className={styles.wrapper}>
               {currentStep !== 3 && (
                  <p className={styles.iconLabel} onClick={handlePreviousStep}>
                     <TbArrowNarrowLeft size={24} /> Return to page
                  </p>
               )}

               {currentStep === 1 && (
                  <>
                     <div className={styles.selectProgram}>
                        <div className={styles.info}>
                           <h2 className={styles.title}>Choose a program</h2>
                           <p className={styles.desc}>
                              Select a program to view/edit its curriculum.
                           </p>
                           {curriculumData.length === 0 && (
                              <MessageWarning
                                 title="This program does not have a curriculum!"
                                 message="Create one by proceeding to the next step."
                              />
                           )}
                        </div>
                        <div className={styles.programsList}>
                           {programs.map((program) => (
                              <div
                                 className={`${styles.programCard} ${
                                    selectedProgram?.code === program?.code
                                       ? styles.active
                                       : ""
                                 }`}
                                 onClick={() => handleSelectProgram(program)}
                                 key={program.code}
                              >
                                 <h3>{program.description}</h3>
                                 <p className={styles.badge}>{program.code}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <button
                        onClick={handleNextStep}
                        className={`${styles.primaryBtn} ${styles.ctaBtn}`}
                     >
                        Next step
                     </button>
                  </>
               )}

               {currentStep === 2 && (
                  <>
                     <div className={styles.programInfo}>
                        <h1>
                           {programData?.description} ({programData?.code})
                        </h1>
                        <div className={styles.breadcrumbContainer}>
                           <p>Overview</p>
                           {currentMode !== "base" && (
                              <p>/ {pageLabels[currentMode]}</p>
                           )}
                        </div>
                     </div>

                     {currentMode === "base" ? (
                        <div className={styles.editWrapper}>
                           <div className={styles.buttonContainer}>
                              <button
                                 onClick={() => setCurrentMode("create")}
                                 className={styles.primaryBtn}
                              >
                                 <TbPlus size={20} /> Create curriculum
                              </button>
                              <button
                                 onClick={() => setCurrentMode("edit")}
                                 className={styles.secondaryBtn}
                              >
                                 <TbEdit size={20} /> Edit curriculum
                              </button>
                           </div>

                           <h2 className={styles.title}>Summary</h2>
                           <div className={styles.summaryContainer}>
                              {Array.from(
                                 { length: programData.duration },
                                 (_, index) => (
                                    <YearCard key={index} yearIndex={index} />
                                 )
                              )}
                           </div>

                           <div className={styles.editContainer}>
                              {[
                                 {
                                    title: "Core courses",
                                    desc: "Mandatory courses essential to the field.",
                                    data: curriculumData[0].courses,
                                 },
                                 {
                                    title: "Elective courses",
                                    desc: "Courses for exploring additional interests.",
                                    data: curriculumData[0].electiveCourses,
                                 },
                              ].map((section, index) => (
                                 <CurriculumSection key={index} {...section} />
                              ))}
                           </div>
                        </div>
                     ) : (
                        <ManageCurriculum
                           token={token}
                           users={users}
                           courses={courses}
                           programData={programData}
                           curriculumData={curriculumData}
                           selectedProgram={selectedProgram}
                           handlePreviousStep={handlePreviousStep}
                           handleSuccess={handleSuccess}
                           currentMode={currentMode}
                        />
                     )}
                  </>
               )}

               {currentStep === 3 && (
                  <div className={styles.success}>
                     <div className={styles.content}>
                        <TbCircleCheckFilled color="green" size={100} />
                        <h2 className={styles.title}>
                           {successType === "create"
                              ? "Curriculum created successfully!"
                              : "Curriculum edited successfully!"}
                        </h2>
                        <p className={styles.desc}>
                           {successType === "create"
                              ? "Head back to the initial page to create or edit another program’s curriculum."
                              : "Head back to the initial page to make further edits or create new curriculums."}
                        </p>
                     </div>
                     <a href="/admin/dashboard/academic-planner/curriculums">
                        <button type="button" className={styles.primaryBtn}>
                           Back to initial page
                        </button>
                     </a>
                  </div>
               )}
            </section>
         </div>
      </Layout>
   );
};

export default Curriculum;

import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import Switch from "components/ui/Switch/Switch";
import { FormSelect } from "components/ui/Form";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import { useForm } from "react-hook-form";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";

import styles from "./Curriculum.module.scss";
import { TbArrowNarrowLeft, TbCircleCheckFilled } from "react-icons/tb";
import CourseTable from "./components/CourseTable/CourseTable";

const Curriculum = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [isSwitchOn, setIsSwitchOn] = useState(false);
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [programData, setProgramData] = useState(null);
   const [curriculumData, setCurriculumData] = useState(null);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const setClickCounts = useState({});

   const token = localStorage.getItem("token");
   const { data: programs } = useFetchData("program", token);
   const { data: curriculums } = useFetchData("curriculum", token);
   const { data: courses } = useFetchData("course", token);
   const { data: users } = useFetchData("user", token);
   const { postData, loading } = usePostData();
   const { register, handleSubmit } = useForm();

   const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);
   const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);

   const handleSwitch = () => {
      setIsSwitchOn((prev) => !prev);
      setClickCounts({});
      setSelectedCourses([]);
      setSelectedElectiveCourses([]);
   };

   const handleSelectProgram = (program) => {
      if (selectedProgram === program) {
         setSelectedProgram(null);
         setProgramData(null);
         setCurriculumData(null);
      } else {
         setSelectedProgram(program);
         setProgramData(program);

         const curriculumData = curriculums.find(
            (curriculum) => curriculum.programId === program.programId
         );
         setCurriculumData(curriculumData);
         console.log(curriculumData);
      }
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
      const endpoint = "curriculum";
      await postData(payload, endpoint, token);

      handleNextStep();
   };

   return (
      <Layout role="admin" pageName="Curriculum">
         <div className={styles.mainContent}>
            <section className={styles.wrapper}>
               {currentStep !== 3 && (
                  <a href="/admin/dashboard/academic-planner">
                     <div className={styles.iconLabel}>
                        <TbArrowNarrowLeft size={24} />
                        <p>Return to page</p>
                     </div>
                  </a>
               )}
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
                                 message="Please create one for it immediately by proceeding to the next step."
                              />
                           )}
                        </div>
                        <div className={styles.programsList}>
                           {programs.map((program) => (
                              <div
                                 className={`${styles.programCard} ${
                                    selectedProgram?.collegeCode ===
                                    program?.collegeCode
                                       ? styles.active
                                       : ""
                                 }`}
                                 onClick={() => handleSelectProgram(program)}
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
                        className={`${styles.primaryBtn} ${styles.ctaBtn}`}
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
                     {curriculumData === undefined ? (
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
                                 onClick={handleSubmit(onCreateSubmit)}
                                 className={styles.primaryBtn}
                              >
                                 Create curriculum {loading && <Loading />}
                              </button>
                           </div>
                        </form>
                     ) : (
                        <div className={styles.editWrapper}>
                           <h2>Curriculum Summary</h2>
                           <div className={styles.curriculumContainer}>
                              {Array.from(
                                 { length: programData.duration },
                                 (_, index) => {
                                    const yearLevelString = {
                                       1: "First Year",
                                       2: "Second Year",
                                       3: "Third Year",
                                       4: "Fourth Year",
                                       5: "Fifth Year",
                                    };
                                    return (
                                       <div
                                          className={`${styles.curriculumCard}`}
                                       >
                                          <p className={styles.badge}>
                                             {yearLevelString[index + 1]}
                                          </p>
                                       </div>
                                    );
                                 }
                              )}
                           </div>
                           <div className={styles.editContainer}>
                              <div>
                                 <h2 className={styles.title}>Core courses</h2>
                                 <CourseTable
                                    courses={curriculumData.courses}
                                 />
                              </div>
                              <div>
                                 <h2 className={styles.title}>
                                    Elective courses
                                 </h2>
                                 <CourseTable
                                    courses={curriculumData.electiveCourses}
                                 />
                              </div>
                           </div>
                        </div>
                     )}
                  </>
               )}
               {currentStep === 3 && (
                  <>
                     <div className={styles.success}>
                        <div className={styles.content}>
                           <TbCircleCheckFilled color="green" size={100} />
                           <h2 className={styles.title}>
                              Curriculum created succesfully!
                           </h2>
                           <p className={styles.desc}>
                              You can head back now to the inital page and
                              choose another program to create/edit its
                              curriculum.
                           </p>
                        </div>
                        <a href="/admin/dashboard/academic-planner/curriculums">
                           <button type="button" className={styles.primaryBtn}>
                              Back to initial page
                           </button>
                        </a>
                     </div>
                  </>
               )}
            </section>
         </div>
      </Layout>
   );
};

export default Curriculum;

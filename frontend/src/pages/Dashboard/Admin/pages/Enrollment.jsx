import React, { useState } from "react";
import styles from "./Enrollment.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Breadcrumb from "components/Navigation/Breadcrumb";
import Table from "components/Table/Table";
import UserTable from "components/Table/UserTable";
import SearchBar from "components/SearchBar/SearchBar";

import IconSizes from "constants/IconSizes";
import useFetchData from "hooks/useFetchData";
import { format } from "date-fns";

const Enrollment = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [searchedStudent, setSearchedStudent] = useState(null);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElective, setSelectedElective] = useState([]);

   const steps = ["Enrollment", "Select a student", "Select courses"];

   const { data: students } = useFetchData("student");
   const { data: enrollments } = useFetchData("enrollment");
   const { data: programs } = useFetchData("program");
   const { data: courses } = useFetchData("course");
   const { data: curriculums } = useFetchData("curriculum");

   const studentProgram = programs.find(
      (program) => program._id === searchedStudent?.programId
   );

   const studentCurriculum = curriculums.find(
      (curriculum) => curriculum._id === searchedStudent?.curriculumId
   );

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const handleNextStep = () => setCurrentStep((prev) => prev + 1);

   const handlePreviousStep = () => {
      setCurrentStep((prev) => prev - 1);
      setSearchedStudent(null);
   };

   const handleSearchedStudent = (student) => {
      setSearchedStudent(student);
      handleNextStep();
   };

   const handleSelectCourse = (courseId) => {
      setSelectedCourses((prevSelectedCourses) =>
         prevSelectedCourses.includes(courseId)
            ? prevSelectedCourses.filter((c) => c !== courseId)
            : [...prevSelectedCourses, courseId]
      );
   };

   const handleSelectAllCourses = (data) => {
      setSelectedCourses(data);
   };

   const CourseCard = ({ data }) => {
      if (!data || !Array.isArray(data)) return null;

      return data.map((courseId) => {
         const course = courses.find((course) => course._id === courseId);
         return course ? (
            <div
               key={course._id}
               className={`${styles.courseCard} 
               ${selectedCourses.includes(course._id) ? styles.selected : ""}
               ${selectedElective.includes(course._id) ? styles.selected : ""}`}
               onClick={() => handleSelectCourse(courseId)}
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
         ) : null;
      });
   };

   const renderStudentData = (data) => {
      const program = programs.find(
         (program) => program._id === data.programId
      );

      return (
         <>
            <div className={styles.userContainer}>
               <UserIcon image={data.userPhoto} size={48} />
               <div className={styles.userInfo}>
                  <h4
                     className={styles.title}
                  >{`${data.firstName} ${data.lastName}`}</h4>
                  <p className={styles.desc}>{data.email}</p>
               </div>
            </div>
            <p className={styles.role}>
               {program?.code} {data.yearLevel}
            </p>
            <p className={styles.lastActive}>No courses enrolled</p>
            <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
         </>
      );
   };

   const StudentView = () => {
      const headers = ["Name", "Program", "Courses", "Enrolled On"];

      const renderPopupContent = (data) => (
         <div className={styles.popupWrapper}>
            <div className={styles.popupContent}>
               <button type="button" className={styles.iconCta}>
                  <TbEdit size={IconSizes.POPUP} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={IconSizes.POPUP} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={IconSizes.POPUP} />
                  Delete user
               </button>
            </div>
         </div>
      );

      return (
         <Table
            data={students}
            headers={headers}
            content={renderStudentData}
            popupContent={renderPopupContent}
            ctaText="Enroll student"
            ctaAction={() => handleNextStep()}
         />
      );
   };

   const CourseView = () => {
      const headers = ["Name", "Program", "Instructor", "Created On"];

      const renderData = (data) => {
         return (
            <>
               <p></p>
               <p className={styles.role}>{data.programId}</p>
               <p className={styles.lastActive}>{data.curriculumId}</p>
               <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
            </>
         );
      };

      const renderPopupContent = (data) => (
         <div className={styles.popupWrapper}>
            <div className={styles.popupContent}>
               <button type="button" className={styles.iconCta}>
                  <TbEdit size={IconSizes.POPUP} />
                  Edit details
               </button>
               <button type="button" className={styles.iconCta}>
                  <TbFileArrowRight size={IconSizes.POPUP} />
                  Export details
               </button>
               <button
                  type="button"
                  className={`${styles.deleteBtn} ${styles.iconCta}`}
               >
                  <TbTrash size={IconSizes.POPUP} />
                  Delete user
               </button>
            </div>
         </div>
      );

      return (
         <Table
            data={enrollments}
            headers={headers}
            content={renderData}
            popupContent={renderPopupContent}
            ctaText="Enroll student"
            ctaAction={() => handleNextStep()}
         />
      );
   };

   const tabs = [
      { label: "Students", content: <StudentView /> },
      { label: "Courses", content: <CourseView /> },
   ];

   return (
      <Layout role="admin" pageName="Enrollment">
         <main className={styles.mainContent}>
            <div className={styles.header}>
               <Breadcrumb
                  base="academic-planner"
                  steps={steps}
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
               />
               <h1 className={styles.title}>{steps[currentStep - 1]}</h1>
            </div>
            <section className={styles.contentWrapper}>
               {currentStep === 1 && <TabMenu tabs={tabs} />}
               {currentStep === 2 && (
                  <div className={styles.selectStudentWrapper}>
                     <SearchBar
                        data={students}
                        height="3rem"
                        placeholder="Search for a student to enroll"
                        onSearch={handleSearchedStudent}
                     />
                     <UserTable
                        data={students}
                        headers={["Name", "Program", "Courses", "Created on"]}
                        content={renderStudentData}
                        isClickable={true}
                        clickableAction={handleSearchedStudent}
                     />
                  </div>
               )}
               {currentStep === 3 && (
                  <div
                     className={styles.searchContent}
                     key={searchedStudent._id}
                  >
                     <div className={styles.sideContent}>
                        <div className={styles.userContainer}>
                           <UserIcon
                              image={searchedStudent.userPhoto}
                              size={110}
                           />
                           <div>
                              <h2 className={styles.title}>
                                 {searchedStudent.firstName}{" "}
                                 {searchedStudent.lastName}
                              </h2>
                              <p className={styles.desc}>
                                 {searchedStudent.email}
                              </p>
                              <div className={styles.line}></div>
                              <div className={styles.userInfo}>
                                 <div className={styles.twoColumn}>
                                    <h3>Program</h3>
                                    <p>{studentProgram?.code}</p>
                                 </div>
                                 <div className={styles.twoColumn}>
                                    <h3>Year Level</h3>
                                    <p>{searchedStudent.yearLevel}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className={styles.curriculumContent}>
                        <div className={styles.instructions}>
                           <h3 className={styles.title}>Instructions</h3>
                           <p className={styles.desc}>
                              Please select the courses you'd like to enroll in.
                              Click on each course to add it to your selection.
                           </p>
                        </div>
                        <div className={styles.coreCourses}>
                           <div className={styles.spaceBetween}>
                              <h3>
                                 Core courses{" "}
                                 <span className={styles.badge}>
                                    {studentCurriculum?.courses?.length || 0}
                                 </span>
                              </h3>
                              <button
                                 type="button"
                                 className={styles.primaryBtn}
                                 onClick={() =>
                                    handleSelectAllCourses(
                                       studentCurriculum?.courses
                                    )
                                 }
                              >
                                 Select all
                              </button>
                           </div>
                           <div className={styles.courseContainer}>
                              <CourseCard data={studentCurriculum?.courses} />
                           </div>
                        </div>
                        <div className={styles.electiveCourses}>
                           <div className={styles.spaceBetween}>
                              <h3>
                                 Core courses{" "}
                                 <span className={styles.badge}>
                                    {studentCurriculum?.electiveCourses
                                       ?.length || 0}
                                 </span>
                              </h3>
                              <button
                                 type="button"
                                 className={styles.primaryBtn}
                                 onClick={() =>
                                    handleSelectAllCourses(
                                       studentCurriculum?.electiveCourses
                                    )
                                 }
                              >
                                 Select all
                              </button>
                           </div>
                           <div className={styles.courseContainer}>
                              <CourseCard
                                 data={studentCurriculum?.electiveCourses}
                              />
                           </div>
                        </div>
                        <div className={styles.buttonContainer}>
                           <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                              onClick={() => handlePreviousStep()}
                           >
                              Cancel
                           </button>
                           <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.primaryBtn}`}
                           >
                              Enroll student
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </section>
         </main>
      </Layout>
   );
};

export default Enrollment;

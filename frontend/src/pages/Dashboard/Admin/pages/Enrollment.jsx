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
import usePostData from "hooks/usePostData";

const Enrollment = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [searchedStudent, setSearchedStudent] = useState(null);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);
   const [, setAllCoreSelected] = useState(false);
   const [, setAllElectiveSelected] = useState(false);

   const { data: students } = useFetchData("student");
   const { data: enrollments } = useFetchData("enrollment");
   const { data: programs } = useFetchData("program");
   const { data: courses } = useFetchData("course");
   const { data: curriculums } = useFetchData("curriculum");
   const { postData } = usePostData();

   const steps = [
      "Enrollment",
      "Choose a Student",
      "Select Courses",
      "Assign Section to Courses",
   ];

   const studentProgram = React.useMemo(
      () =>
         programs.find((program) => program._id === searchedStudent?.programId),
      [searchedStudent, programs]
   );

   const studentCurriculum = React.useMemo(
      () =>
         curriculums.find(
            (curriculum) => curriculum._id === searchedStudent?.curriculumId
         ),
      [searchedStudent, curriculums]
   );

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const handleNextStep = () => setCurrentStep((prev) => prev + 1);
   const handlePreviousStep = () => {
      if (currentStep === 2) {
         setSearchedStudent(null);
      }
      setCurrentStep((prev) => prev - 1);
   };

   const handleSearchedStudent = (student) => {
      setSearchedStudent(student);
      handleNextStep();
   };

   const handleSelectCourse = (courseId, type) => {
      const updateSelection = (current, setCurrent) =>
         current.includes(courseId)
            ? current.filter((id) => id !== courseId)
            : [...current, courseId];

      if (type === "core") {
         setSelectedCourses((prev) =>
            updateSelection(prev, setSelectedCourses)
         );
      } else if (type === "elective") {
         setSelectedElectiveCourses((prev) =>
            updateSelection(prev, setSelectedElectiveCourses)
         );
      }
   };

   const handleSelectAllCourses = (courses, type) => {
      const selectedState =
         type === "core" ? selectedCourses : selectedElectiveCourses;
      const setSelectedState =
         type === "core" ? setSelectedCourses : setSelectedElectiveCourses;
      const allSelected = courses.every((course) =>
         selectedState.includes(course._id)
      );

      if (allSelected) {
         setSelectedState([]);
         if (type === "core") setAllCoreSelected(false);
         else setAllElectiveSelected(false);
      } else {
         const courseIds = courses.map((course) => course._id);
         setSelectedState(courseIds);
         if (type === "core") setAllCoreSelected(true);
         else setAllElectiveSelected(true);
      }
   };

   // const handleEnrollStudent = async () => {
   //    const allSelectedCourses = [
   //       ...selectedCourses,
   //       ...selectedElectiveCourses,
   //    ];
   //    const payload = {
   //       courseIds: allSelectedCourses,
   //       studentId: searchedStudent,
   //    };
   //    await postData(payload, "enrollment/batch-enroll");
   // };

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

   function CourseList({
      data,
      selectedCourses,
      onSelectCourse,
      handleSelectAllCourses,
      type,
   }) {
      const handleCourseSelection = (courseId) => {
         onSelectCourse(courseId, type);
      };

      return (
         <div className={styles[`${type}Courses`]}>
            <div className={styles.spaceBetween}>
               <h3>{type === "core" ? "Core courses" : "Elective courses"}</h3>
               <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => handleSelectAllCourses(courses, type)}
               >
                  {selectedCourses.length === courses.length
                     ? "Deselect all"
                     : "Select all"}
               </button>
            </div>
            <div className={styles.courseContainer}>
               {data.map((courseId) => {
                  const course = courses.find(
                     (course) => course._id === courseId
                  );
                  return (
                     <div
                        key={course._id}
                        className={`${styles.courseCard} ${
                           selectedCourses.includes(course._id)
                              ? styles.selected
                              : ""
                        }`}
                        onClick={() => handleCourseSelection(course._id)}
                     >
                        <div className={styles.courseTitle}>
                           <h3 className={styles.title}>
                              {course.description}
                           </h3>
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
         </div>
      );
   }

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
                        <CourseList
                           data={studentCurriculum?.courses}
                           selectedCourses={selectedCourses}
                           onSelectCourse={handleSelectCourse}
                           handleSelectAllCourses={handleSelectAllCourses}
                           type="core"
                        />
                        <CourseList
                           data={studentCurriculum?.electiveCourses}
                           selectedCourses={selectedElectiveCourses}
                           onSelectCourse={handleSelectCourse}
                           handleSelectAllCourses={handleSelectAllCourses}
                           type="elective"
                        />
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
                              onClick={() => handleNextStep()}
                           >
                              Next step
                           </button>
                        </div>
                     </div>
                  </div>
               )}
               {currentStep === 4 && (
                  <div className={styles.selectSectionWrapper}>
                     <h2>Course name</h2>
                     <div className={styles.sectionsContainer}>
                        <div className={styles.sectionCard}>
                           <h3>Section Name</h3>
                           <h3>Instructor</h3>
                           <p>Start time - end time</p>
                           <p>Days</p>
                           <p>Room</p>
                           <p>Available Slots</p>
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

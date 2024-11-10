import React, { useEffect, useState } from "react";
import styles from "./Enrollment.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";
import userPhoto from "assets/images/profile.jpg";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Breadcrumb from "components/Navigation/Breadcrumb";
import Table from "components/Table/Table";
import SearchBar from "components/SearchBar/SearchBar";

import IconSizes from "constants/IconSizes";
import useFetchData from "hooks/useFetchData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

const Enrollment = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [searchedStudent, setSearchedStudent] = useState(null);

   const steps = ["Enrollment", "Enroll student"];

   const { register, handleSubmit, reset } = useForm();
   const { data: students } = useFetchData("student");
   const { data: enrollments } = useFetchData("enrollment");
   const { data: programs } = useFetchData("program");
   const { data: courses } = useFetchData("course");
   const { data: curriculums } = useFetchData("curriculum");
   const { data: sections } = useFetchData("section");
   const { data: schedules } = useFetchData("schedule");

   const handleSearch = (query) => {
      setSearchedStudent(query);
   };

   const selectedProgram = programs.find(
      (program) => program._id === searchedStudent?.programId
   );

   const handleNextStep = () => setCurrentStep((prev) => prev + 1);

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const StudentView = () => {
      const headers = ["Name", "Program", "Courses", "Enrolled On"];

      const renderData = (data) => {
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
            content={renderData}
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
            <section className={styles.tableWrapper}>
               {currentStep === 1 && <TabMenu tabs={tabs} />}
               {currentStep === 2 && (
                  <div className={styles.selectStudentWrapper}>
                     <SearchBar
                        data={students}
                        onSearch={handleSearch}
                        height="3rem"
                     />
                     <div className={styles.searchContent}>
                        {searchedStudent && (
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
                                       <p>{selectedProgram?.code}</p>
                                    </div>
                                    <div className={styles.twoColumn}>
                                       <h3>Year Level</h3>
                                       <p>{searchedStudent.yearLevel}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                        <div className={styles.curriculumContainer}>
                           <div className={styles.coreCourses}>
                              <h3>
                                 Core courses{" "}
                                 <span className={styles.badge}>5</span>
                              </h3>
                              {/* <div className={styles.courseCard}>
                                 <div className={styles.courseTitle}>
                                    <h3 className={styles.title}>
                                       {course.description}
                                    </h3>
                                    <p className={styles.badge}>
                                       {course.code}
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
                              </div> */}
                           </div>
                           <div className={styles.electiveCourses}>
                              <h3>
                                 Elective courses{" "}
                                 <span className={styles.badge}>2</span>
                              </h3>
                           </div>
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

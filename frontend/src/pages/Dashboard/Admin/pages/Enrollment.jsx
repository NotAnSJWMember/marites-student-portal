import React, { useEffect, useMemo, useState } from "react";
import styles from "./Enrollment.module.scss";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Breadcrumb from "components/Navigation/Breadcrumb";
import Table from "components/Table/Table";
import UserTable from "components/Table/UserTable";
import SearchBar from "components/SearchBar/SearchBar";
import Timeline from "components/Timeline/Timeline";

import useFetchData from "hooks/useFetchData";
import { format } from "date-fns";

const Enrollment = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [currentItemStep, setCurrentItemStep] = useState(0);
   const [currentItemCourse, setCurrentItemCourse] = useState(null);
   const [searchedStudent, setSearchedStudent] = useState(null);
   const [selectedCourses, setSelectedCourses] = useState([]);
   const [selectedElectiveCourses, setSelectedElectiveCourses] = useState([]);

   const { data: students } = useFetchData("student");
   const { data: instructors } = useFetchData("instructor");
   const { data: enrollments } = useFetchData("enrollment");
   const { data: programs } = useFetchData("program");
   const { data: courses } = useFetchData("course");
   const { data: curriculums } = useFetchData("curriculum");
   const { data: sections } = useFetchData("section");

   const steps = ["Enrollment", "Choose a Student", "Select Courses", "Assign Section to Courses"];

   const studentProgram = useMemo(
      () => programs.find((program) => program._id === searchedStudent?.programId),
      [searchedStudent, programs]
   );

   const studentCurriculum = useMemo(
      () => curriculums.find((curriculum) => curriculum._id === searchedStudent?.curriculumId),
      [searchedStudent, curriculums]
   );

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const handleNextStep = () => {
      if (currentStep === 3) setCurrentItemCourse(selectedCourses[0]);
      setCurrentStep((prev) => prev + 1);
   };
   const handlePreviousStep = () => {
      if (currentStep === 2) setSearchedStudent(null);
      setCurrentStep((prev) => Math.max(prev - 1, 1));
   };

   const handleSearchedStudent = (student) => {
      setSearchedStudent(student);
      handleNextStep();
   };

   const handleSelectCourse = (courseId, type) => {
      const setCourses = type === "core" ? setSelectedCourses : setSelectedElectiveCourses;
      const courses = type === "core" ? selectedCourses : selectedElectiveCourses;
      setCourses(
         courses.includes(courseId)
            ? courses.filter((id) => id !== courseId)
            : [...courses, courseId]
      );
   };

   const handleSelectAllCourses = (courseIds, type) => {
      const setCourses = type === "core" ? setSelectedCourses : setSelectedElectiveCourses;
      const courses = type === "core" ? selectedCourses : selectedElectiveCourses;
      setCourses(courses.length === courseIds.length ? [] : courseIds);
   };

   const renderStudentData = (data) => {
      const program = programs.find((program) => program._id === data.programId);

      return (
         <>
            <div className={styles.userContainer}>
               <UserIcon image={data.userPhoto} size={48} />
               <div className={styles.userInfo}>
                  <h4 className={styles.title}>{`${data.firstName} ${data.lastName}`}</h4>
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
         <button className={styles.iconCta}>Edit details</button>
         <button className={styles.iconCta}>Export details</button>
         <button className={`${styles.deleteBtn} ${styles.iconCta}`}>Delete user</button>
      </div>
   );

   const StudentView = () => {
      return (
         <Table
            data={students}
            headers={["Name", "Program", "Courses", "Enrolled On"]}
            content={renderStudentData}
            popupContent={renderPopupContent}
            ctaText='Enroll student'
            ctaAction={() => handleNextStep()}
         />
      );
   };

   const CourseView = () => {
      <Table
         data={enrollments}
         headers={["Name", "Program", "Instructor", "Created On"]}
         content={(data) => (
            <>
               <p>{data.name}</p>
               <p>{data.programId}</p>
               <p>{data.curriculumId}</p>
               <p>{formatDate(data.createdAt)}</p>
            </>
         )}
         popupContent={renderPopupContent}
         ctaText='Enroll student'
         ctaAction={handleNextStep}
      />;
   };

   const CourseList = ({ data, type, onSelectCourse, selectedCourses }) => (
      <div className={styles[`${type}Courses`]}>
         <div className={styles.spaceBetween}>
            <h3>{type === "core" ? "Core courses" : "Elective courses"}</h3>
            <button
               className={styles.primaryBtn}
               onClick={() => handleSelectAllCourses(data, type)}
            >
               {selectedCourses.length === data.length ? "Deselect all" : "Select all"}
            </button>
         </div>
         <div className={styles.courseContainer}>
            {data.map((courseId) => {
               const course = courses.find((c) => c._id === courseId);
               return (
                  <div
                     key={course._id}
                     className={`${styles.courseCard} ${
                        selectedCourses.includes(course._id) ? styles.selected : ""
                     }`}
                     onClick={() => onSelectCourse(course._id)}
                  >
                     <div className={styles.courseTitle}>
                        <h3>{course.description}</h3>
                        <p>{course.code}</p>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );

   const handleNextTimelineStep = () => {
      if (currentItemStep < coreTimelineItems.length - 1) {
         setCurrentItemStep(currentItemStep + 1);
      }
   };

   const handlePreviousTimelineStep = () => {
      if (currentItemStep !== 0) {
         setCurrentItemStep(currentItemStep - 1);
      }
   };

   const courseMap = useMemo(() => {
      return courses.reduce((map, course) => {
         map[course._id] = course;
         return map;
      }, {});
   }, [courses]);

   const coreTimelineItems = useMemo(() => {
      return selectedCourses.map((courseId, index) => {
         const course = courseMap[courseId];
         return {
            label: course?.code || "Unknown Course",
            description: course?.description || "No description available",
            isActive: index === currentItemStep,
         };
      });
   }, [selectedCourses, currentItemStep, courseMap]);

   const electiveTimelineItems = useMemo(() => {
      return selectedElectiveCourses.map((courseId, index) => {
         const course = courseMap[courseId];
         return {
            label: course?.code || "Unknown Course",
            description: course?.description || "No description available",
            isActive: index === currentItemStep,
         };
      });
   }, [selectedElectiveCourses, currentItemStep, courseMap]);

   const currentItemSections = useMemo(() => {
      return currentItemCourse
         ? sections.filter((section) => section.courseId === currentItemCourse?._id)
         : [];
   }, [currentItemCourse, sections]);

   const tabs = [
      { label: "Students", content: <StudentView /> },
      { label: "Courses", content: <CourseView /> },
   ];

   useEffect(() => {
      console.log("Selected courses: ", selectedCourses);
      console.log("Current timeline step: ", currentItemStep);
      console.log("Current course: ", currentItemCourse);
      console.log("Current course sections: ", currentItemSections);
   });

   return (
      <Layout role='admin' pageName='Enrollment'>
         <main className={styles.mainContent}>
            <div className={styles.header}>
               <Breadcrumb
                  base='academic-planner'
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
                        height='3rem'
                        placeholder='Search for a student to enroll'
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
                  <div className={styles.searchContent} key={searchedStudent._id}>
                     <div className={styles.sideContent}>
                        <div className={styles.userContainer}>
                           <UserIcon image={searchedStudent.userPhoto} size={110} />
                           <div>
                              <h2 className={styles.title}>
                                 {searchedStudent.firstName} {searchedStudent.lastName}
                              </h2>
                              <p className={styles.desc}>{searchedStudent.email}</p>
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
                              Please select the courses you'd like to enroll in. Click on each
                              course to add it to your selection.
                           </p>
                        </div>
                        <CourseList
                           data={studentCurriculum?.courses}
                           type='core'
                           selectedCourses={selectedCourses}
                           onSelectCourse={handleSelectCourse}
                           handleSelectAllCourses={handleSelectAllCourses}
                        />
                        <CourseList
                           data={studentCurriculum?.electiveCourses}
                           type='elective'
                           selectedCourses={selectedElectiveCourses}
                           onSelectCourse={handleSelectCourse}
                           handleSelectAllCourses={handleSelectAllCourses}
                        />
                        <div className={styles.buttonContainer}>
                           <button
                              type='button'
                              className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                              onClick={() => handlePreviousStep()}
                           >
                              Cancel
                           </button>
                           <button
                              type='button'
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
                     <div className={styles.sideContent}>
                        <div>
                           <h2>Core courses</h2>
                           <div className={styles.line}></div>
                           <Timeline items={coreTimelineItems} currentStep={currentItemStep} />
                        </div>
                        <div>
                           <h2>Elective courses</h2>
                           <div className={styles.line}></div>
                           <Timeline items={electiveTimelineItems} currentStep={currentItemStep} />
                        </div>
                     </div>
                     <div className={styles.mainContent}>
                        <h2>{currentItemCourse?.description}</h2>
                        <div className={styles.sectionsContainer}>
                           {currentItemSections.map((section) => {
                              const instructor = instructors.find(
                                 (instructor) => instructor.userId === section.instructorId
                              );
                              return (
                                 <div className={styles.sectionCard}>
                                    <h3>{section.description}</h3>
                                    <p>
                                       {instructor?.firstName} {instructor?.lastName}
                                    </p>
                                    <p>{section?.roomCode}</p>
                                    <p>
                                       {section?.startTime} - {section?.endTime}
                                    </p>
                                    <ul>
                                       {section?.days.map((day) => (
                                          <li>{day}</li>
                                       ))}
                                    </ul>
                                    <p>{section?.availableSlots}</p>
                                 </div>
                              );
                           })}
                        </div>
                        <div className={styles.buttonContainer}>
                           <button
                              type='button'
                              className={styles.secondaryBtn}
                              onClick={() => handlePreviousTimelineStep()}
                           >
                              Previous course
                           </button>
                           <button
                              type='button'
                              className={styles.primaryBtn}
                              onClick={() => handleNextTimelineStep()}
                           >
                              Next course
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

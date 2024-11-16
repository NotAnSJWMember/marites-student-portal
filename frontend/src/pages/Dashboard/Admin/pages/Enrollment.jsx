/* eslint-disable react-hooks/exhaustive-deps */
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
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  const [currentTimelineCourse, setCurrentTimelineCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState({ core: [], elective: [] });
  const [selectedCourses, setSelectedCourses] = useState({ core: [], elective: [] });

  const { data: students } = useFetchData("student");
  const { data: instructors } = useFetchData("instructor");
  const { data: enrollments } = useFetchData("enrollment");
  const { data: programs } = useFetchData("program");
  const { data: courses } = useFetchData("course");
  const { data: curriculums } = useFetchData("curriculum");
  const { data: sections } = useFetchData("section");

  const steps = [
    "Enrollment",
    "Choose a Student",
    "Select Courses",
    "Assign Section to Courses",
  ];

  const courseMap = useMemo(() => {
    return courses.reduce((map, course) => {
      map[course._id] = course;
      return map;
    }, {});
  }, [courses]);

  const studentProgram = useMemo(
    () => programs.find((program) => program._id === selectedStudent?.programId),
    [selectedStudent, programs]
  );

  const studentCurriculum = useMemo(
    () => curriculums.find((curriculum) => curriculum._id === selectedStudent?.curriculumId),
    [selectedStudent, curriculums]
  );

  useEffect(() => {
    if (studentCurriculum) {
      setStudentCourses({
        core: studentCurriculum.courses,
        elective: studentCurriculum.electiveCourses,
      });
    }
  }, [studentCurriculum]);

  const courseSections = useMemo(() => {
    return currentTimelineCourse
      ? sections.filter((section) => section.courseId === currentTimelineCourse?._id)
      : [];
  }, [currentTimelineCourse, sections]);

  const findCourse = (courseId) => {
    return courses.find((course) => course._id === courseId);
  };

  const formatDate = (isoString) => {
    return format(new Date(isoString), "MMMM d, yyyy");
  };

  const handleSearch = (student) => {
    setSelectedStudent(student);
    handleNextStep();
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      setCurrentTimelineCourse(
        findCourse(studentCourses.core[0] || studentCourses.elective[0])
      );
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) setSelectedStudent(null);
    if (currentStep === 3) setSelectedCourses({ core: [], elective: [] });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNextTimelineStep = () => {
    if (
      currentTimelineStep <
      studentCourses.core.length + studentCourses.elective.length - 1
    ) {
      setCurrentTimelineStep(currentTimelineStep + 1);
      const nextCourse =
        currentTimelineStep + 1 < studentCourses.core.length
          ? studentCourses.core[currentTimelineStep + 1]
          : studentCourses.elective[currentTimelineStep - studentCourses.core.length];
      setCurrentTimelineCourse(findCourse(nextCourse));
    }
  };

  const handlePreviousTimelineStep = () => {
    if (currentTimelineStep > 0) {
      setCurrentTimelineStep(currentTimelineStep - 1);
      const prevCourse =
        currentTimelineStep <= studentCourses.core.length - 1
          ? studentCourses.core[currentTimelineStep - 1]
          : studentCourses.elective[currentTimelineStep - studentCourses.core.length - 1];
      setCurrentTimelineCourse(findCourse(prevCourse));
    }
  };

  const generateTimelineItems = (selectedCourses, courseMap) => {
    return selectedCourses.map((courseId, index) => {
      const course = courseMap[courseId];
      return {
        label: course?.code || "Unknown Course",
        description: course?.description || "No description available",
        isActive: index === currentTimelineStep,
      };
    });
  };

  const coreTimelineItems = useMemo(
    () => generateTimelineItems(selectedCourses.core, courseMap),
    [selectedCourses.core, currentTimelineStep, courseMap]
  );
  const electiveTimelineItems = useMemo(
    () => generateTimelineItems(selectedCourses.elective, courseMap),
    [selectedCourses.elective, currentTimelineStep, courseMap]
  );

  const handleSelectCourse = (courseId, type) => {
    setSelectedCourses((prevState) => {
      const updatedCourses = prevState[type].includes(courseId)
        ? prevState[type].filter((id) => id !== courseId)
        : [...prevState[type], courseId];

      return {
        ...prevState,
        [type]: updatedCourses,
      };
    });
  };

  const handleSelectAllCourses = (courseIds, type) => {
    setSelectedCourses((prevState) => {
      const updatedCourses = prevState[type].length === courseIds.length ? [] : courseIds;

      return {
        ...prevState,
        [type]: updatedCourses,
      };
    });
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
        data={enrollments}
        headers={["Name", "Program", "Courses", "Enrolled On"]}
        content={renderStudentData}
        popupContent={renderPopupContent}
        ctaText="Enroll student"
        ctaAction={() => handleNextStep()}
      />
    );
  };

  const CourseView = () => {
    return (
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
        ctaText="Enroll student"
        ctaAction={handleNextStep}
      />
    );
  };

  const CourseList = ({ data, type }) => {
    return (
      <div className={styles[`${type}Courses`]}>
        <div className={styles.spaceBetween}>
          <h3>{type === "core" ? "Core courses" : "Elective courses"}</h3>
          <button
            className={styles.primaryBtn}
            onClick={() => handleSelectAllCourses(data, type)}
          >
            {selectedCourses?.length === data?.length ? "Deselect all" : "Select all"}
          </button>
        </div>
        <div className={styles.courseContainer}>
          {data?.map((courseId) => {
            const course = courses.find((c) => c._id === courseId);

            return (
              <div
                key={course._id}
                className={`${styles.courseCard} ${
                  selectedCourses[type].includes(course._id) ? styles.selected : null
                }`}
                onClick={() => handleSelectCourse(course._id, type)}
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
            );
          })}
        </div>
      </div>
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
            handlePreviousStep={handlePreviousStep}
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
                onSearch={handleSearch}
              />
              <UserTable
                data={students}
                headers={["Name", "Program", "Courses", "Created on"]}
                content={renderStudentData}
                isClickable={true}
                clickableAction={handleSearch}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className={styles.searchContent} key={selectedStudent._id}>
              <div className={styles.sideContent}>
                <div className={styles.userContainer}>
                  <UserIcon image={selectedStudent.userPhoto} size={110} />
                  <div>
                    <h2 className={styles.title}>
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <p className={styles.desc}>{selectedStudent.email}</p>
                    <div className={styles.line}></div>
                    <div className={styles.userInfo}>
                      <div className={styles.twoColumn}>
                        <h3>Program</h3>
                        <p>{studentProgram?.code}</p>
                      </div>
                      <div className={styles.twoColumn}>
                        <h3>Year Level</h3>
                        <p>{selectedStudent.yearLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.curriculumContent}>
                <div className={styles.instructions}>
                  <h3 className={styles.title}>Instructions</h3>
                  <p className={styles.desc}>
                    Please select the courses you'd like to enroll in. Click on each course to
                    add it to your selection.
                  </p>
                </div>
                <CourseList data={studentCourses.core} type="core" />
                <CourseList data={studentCourses.elective} type="elective" />
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                    onClick={() => handlePreviousStep()}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.primaryBtn}`}
                    onClick={() => handleNextStep()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className={styles.selectSectionWrapper}>
              <div className={styles.sideContent}>
                <div className={styles.timelineContent}>
                  <h2>Core courses</h2>
                  <div className={styles.line}></div>
                  <Timeline items={coreTimelineItems} currentStep={currentTimelineStep} />
                </div>
                <div className={styles.timelineContent}>
                  <h2>Elective courses</h2>
                  <div className={styles.line}></div>
                  <Timeline items={electiveTimelineItems} currentStep={currentTimelineStep} />
                </div>
              </div>
              <div className={styles.sectionsContent}>
                <div className={styles.sectionsContainer}>
                  <h1>Sections for {currentTimelineCourse.description}</h1>
                  {courseSections.map((section) => {
                    const instructor = instructors.find(
                      (instructor) => instructor.userId === section.instructorId
                    );
                    return (
                      section && (
                        <div key={section._id} className={styles.sectionCard}>
                          <h3 className={styles.title}>{section.description}</h3>
                          <ul>
                            {section?.days.map((day, index) => (
                              <li key={index} className={styles.badge}>
                                {day}
                              </li>
                            ))}
                          </ul>
                          <p>
                            {section?.startTime} - {section?.endTime}
                          </p>
                          <p>Room: {section?.roomCode}</p>
                          <p>
                            Slots: {section?.capacity}/{section?.availableSlots}
                          </p>
                          <p>
                            Instructor: {instructor?.firstName} {instructor?.lastName}
                          </p>
                        </div>
                      )
                    );
                  })}
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => handlePreviousStep()}
                  >
                    Back
                  </button>
                  {currentTimelineStep > 0 && (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => handlePreviousTimelineStep()}
                    >
                      Previous course
                    </button>
                  )}
                  <button
                    type="button"
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

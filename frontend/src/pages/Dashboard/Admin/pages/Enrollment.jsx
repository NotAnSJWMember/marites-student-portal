/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Enrollment.module.scss";
import { TbClock, TbMapPin, TbUser } from "react-icons/tb";

import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Breadcrumb from "components/Navigation/Breadcrumb";
import Table from "components/Table/Table";
import UserTable from "components/Table/UserTable";
import SearchBar from "components/SearchBar/SearchBar";
import Timeline from "components/Timeline/Timeline";
import PopupAlert from "components/Popup/PopupAlert";

import IconSizes from "constants/IconSizes";
import useFetchData from "hooks/useFetchData";
import usePostData from "hooks/usePostData";
import { usePopupAlert } from "hooks";
import { format } from "date-fns";
import { debounce } from "lodash";

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState({ core: [], elective: [] });
  const [selectedCourses, setSelectedCourses] = useState({ core: [], elective: [] });
  const [selectedSections, setSelectedSections] = useState({});
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  const [currentTimelineCourse, setCurrentTimelineCourse] = useState(null);

  const { data: students } = useFetchData("student");
  const { data: instructors } = useFetchData("instructor");
  const { data: enrollments } = useFetchData("enrollment");
  const { data: programs } = useFetchData("program");
  const { data: courses } = useFetchData("course");
  const { data: curriculums } = useFetchData("curriculum");
  const { data: sections } = useFetchData("section");
  const { popupState, showPopup, showError } = usePopupAlert();
  const { postData } = usePostData();

  const steps = [
    "Enrollment",
    "Choose a Student",
    "Select Courses",
    "Assign Section to Courses",
  ];

  const groupedEnrollments = Object.values(
    enrollments.reduce((acc, enrollment) => {
      const { studentId, courseId, createdAt } = enrollment;

      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          courses: [],
          createdAt,
        };
      }

      acc[studentId].courses.push(courseId);
      return acc;
    }, {})
  );

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

  const allSelectedCourses = [...selectedCourses.core, ...selectedCourses.elective];

  const allSectionsSelected = allSelectedCourses.every(
    (courseId) => selectedSections[courseId] !== undefined
  );

  const [timelineProgress, setTimelineProgress] = useState(
    allSelectedCourses.map(() => false)
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

  const handleSearch = debounce((student) => {
    setSelectedStudent(student);
    handleNextStep();
  }, 300);

  const handleNextStep = () => {
    if (currentStep === 3) {
      setCurrentTimelineCourse(
        findCourse(selectedCourses.core[0] || selectedCourses.elective[0])
      );
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) {
      setSelectedStudent(null);
      setSelectedCourses({ core: [], elective: [] });
      setSelectedSections({});
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleTimelineNavigation = (direction) => {
    const previousStep = currentTimelineStep;
    const nextStep = currentTimelineStep + direction;

    if (nextStep < 0 || nextStep >= allSelectedCourses.length) return;
    if (selectedSections[currentTimelineCourse._id] === undefined && direction === 1) {
      return showError("No section selected", "Please choose a section for the course.");
    }

    setTimelineProgress((prev) => {
      const updatedProgress = [...prev];
      updatedProgress[previousStep] = true;
      return updatedProgress;
    });

    setCurrentTimelineStep(nextStep);
    setCurrentTimelineCourse(findCourse(allSelectedCourses[nextStep]));
  };

  const timelineItems = useMemo(
    () =>
      allSelectedCourses.map((courseId, index) => {
        const course = courseMap[courseId];
        return {
          label: course?.code || "Unknown Course",
          description: course?.description || "No description available",
          isActive: index === currentTimelineStep,
          isDone: timelineProgress[index],
        };
      }),
    [allSelectedCourses, currentTimelineStep, courseMap, timelineProgress]
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

  const handleSelectSection = (sectionId) => {
    setSelectedSections((prev) => ({
      ...prev,
      [currentTimelineCourse._id]: sectionId,
    }));
  };

  const handleEnrollStudent = async () => {
    const courseIds = Object.keys(selectedSections);
    const sectionIds = Object.values(selectedSections);

    const body = {
      courseIds: courseIds,
      sectionIds: sectionIds,
      studentId: selectedStudent.userId,
    };

    await postData(body, "enrollment/batch-enroll");
  };

  const renderStudentData = (data) => {
    const student = students.find((student) => student.userId === data.studentId);
    const program = programs.find((program) => program._id === student?.programId);

    return (
      student && (
        <>
          <div className={styles.userContainer}>
            <UserIcon image={student.userPhoto} size={48} />
            <div className={styles.userInfo}>
              <h4 className={styles.title}>{`${student.firstName} ${student.lastName}`}</h4>
              <p className={styles.desc}>{student.email}</p>
            </div>
          </div>
          <p className={styles.role}>
            {program?.code} - {student.yearLevel}
          </p>
          <p className={styles.lastActive}>
            {data.courses.length > 0
              ? `${data.courses.length} courses enrolled`
              : "No courses enrolled"}
          </p>
          <p className={styles.createdAt}>{formatDate(student.enrollmentDate)}</p>
        </>
      )
    );
  };

  const renderStudentDataSearch = (data) => {
    const program = programs.find((program) => program._id === data?.programId);

    return (
      data && (
        <>
          <div className={styles.userContainer}>
            <UserIcon image={data.userPhoto} size={48} />
            <div className={styles.userInfo}>
              <h4 className={styles.title}>{`${data.firstName} ${data.lastName}`}</h4>
              <p className={styles.desc}>{data.email}</p>
            </div>
          </div>
          <p className={styles.role}>
            {program?.code} - {data.yearLevel}
          </p>
          <p
            className={`${styles.badge} ${
              data.enrollmentStatus ? styles.greenBadge : styles.redBadge
            }`}
          >
            {data.enrollmentStatus ? "Enrolled" : "Not enrolled"}
          </p>
        </>
      )
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
        data={groupedEnrollments}
        headers={["Name", "Program & Year", "Courses", "Enrolled On"]}
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
                headers={["Name", "Program", "Status"]}
                content={renderStudentDataSearch}
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
                  <h2>Selected Courses</h2>
                  <div className={styles.line}></div>
                  <Timeline items={timelineItems} currentStep={currentTimelineStep} />
                </div>
              </div>
              <div className={styles.sectionsContent}>
                <h1>Enroll in a Section for {currentTimelineCourse?.description}</h1>
                <div className={styles.sectionsContainer}>
                  {courseSections.map((section) => {
                    const instructor = instructors.find(
                      (instructor) => instructor.userId === section.instructorId
                    );
                    return (
                      section && (
                        <div
                          key={section._id}
                          className={`${styles.sectionCard} ${
                            selectedSections[currentTimelineCourse._id]?.includes(section._id)
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleSelectSection(section._id)}
                        >
                          <div className={styles.spaceBetween}>
                            <div>
                              <h3 className={styles.title}>{section.description}</h3>
                              <p className={styles.desc}>
                                {section?.capacity} out of {section?.availableSlots} enrolled
                              </p>
                            </div>
                            <span
                              className={`${styles.badge} ${
                                section?.isActive === true
                                  ? styles.greenBadge
                                  : styles.redBadge
                              }`}
                            >
                              {section?.isActive === true ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className={styles.line}></div>
                          <div className={styles.sectionInfo}>
                            <p className={styles.iconLabel}>
                              <TbUser size={IconSizes.SMALL} />
                              {instructor?.firstName} {instructor?.lastName}
                            </p>
                            <p className={styles.iconLabel}>
                              <TbClock size={IconSizes.SMALL} />
                              {section?.startTime} - {section?.endTime}
                            </p>
                            <p className={styles.iconLabel}>
                              <TbMapPin size={IconSizes.SMALL} />
                              Room {section?.roomCode}
                            </p>
                          </div>
                          <ul>
                            {section?.days.map((day, index) => (
                              <li key={index} className={styles.badge}>
                                {day}
                              </li>
                            ))}
                          </ul>
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
                      onClick={() => handleTimelineNavigation(-1)}
                    >
                      Previous course
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={
                      allSectionsSelected
                        ? () => handleEnrollStudent()
                        : () => handleTimelineNavigation(1)
                    }
                  >
                    {allSectionsSelected ? "Enroll Student" : "Next course"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <PopupAlert
        icon={popupState.icon}
        border={popupState.border}
        color={popupState.color}
        title={popupState.title}
        message={popupState.message}
        show={showPopup}
      />
    </Layout>
  );
};

export default Enrollment;

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Courses.module.scss";

import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import TabMenu from "components/TabMenu/TabMenu";

import { useAuth } from "hooks";
import { useDataContext } from "hooks/contexts/DataContext";
import useFetchData from "hooks/useFetchData";

import { findDataById } from "utils/findDataById";
import { findDataByUserId } from "utils/findDataByUserId";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { user: loggedInUser } = useAuth();
  const { data: user } = useFetchData(`student/${loggedInUser.userId}`);

  const { dataState: enrollments, loadingState: enrollmentsLoading } =
    useDataContext("enrollment");
  const { dataState: instructors, loadingState: instructorsLoading } =
    useDataContext("instructor");
  const { dataState: sections, loadingState: sectionsLoading } =
    useDataContext("section");
  const { dataState: courses, loadingState: coursesLoading } =
    useDataContext("course");

  const studentEnrollments = useMemo(() => {
    return enrollments.filter((e) => e.studentId === user?.userId);
  }, [enrollments, user]);

  const [coreCourses, electiveCourses] = useMemo(() => {
    const core = [];
    const elective = [];
    studentEnrollments.forEach((e) => {
      if (e.type === "core") core.push(e);
      if (e.type === "elective") elective.push(e);
    });
    return [core, elective];
  }, [studentEnrollments]);

  const allCourses = [...coreCourses, ...electiveCourses];

  const handleSelectCourse = (courseId) => {
    setSelectedCourse((prev) =>
      prev === findDataById(courses, courseId)
        ? setSelectedCourse(null)
        : setSelectedCourse(findDataById(courses, courseId))
    );
  };

  const CourseCard = ({ courseId, type }) => {
    const course = useMemo(() => findDataById(courses, courseId), [courseId]);
    const section = useMemo(
      () => sections.find((s) => s.courseId === courseId),
      [courseId]
    );
    const instructor = useMemo(
      () => findDataByUserId(instructors, section?.instructorId),
      [section]
    );
    if (!course) return null;

    return (
      <div
        key={course._id}
        className={`${styles.courseCard} ${
          course._id === selectedCourse?._id ? styles.selected : ""
        }`}
        onClick={() => handleSelectCourse(course._id)}
      >
        <div className={styles.courseInfo}>
          <h2 className={styles.title}>{course.description}</h2>
          <p className={styles.desc}>
            {type !== "all"
              ? `${instructor?.firstName} ${instructor?.lastName}`
              : coreCourses.some((course) => course.courseId === courseId)
              ? "Core"
              : "Elective"}
          </p>
        </div>
        <h2 className={styles.badge}>{course.code}</h2>
      </div>
    );
  };

  const CourseView = ({ data, type }) => (
    <>
      {data.map((course) => (
        <CourseCard
          key={course.courseId}
          courseId={course.courseId}
          type={type}
        />
      ))}
    </>
  );

  const ContentView = () => {
    const course = selectedCourse;
    const section = sections.find((section) => section.courseId === course._id);
    const instructor = instructors.find(
      (instructor) => instructor.userId === section.instructorId
    );

    return (
      <>
        <div className={styles.description}>
          <h2 className={styles.title}>{course.description}</h2>
        </div>
      </>
    );
  };

  const GradeView = () => {
    return (
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <h4>Course</h4>
          <h4>Instructor</h4>
          <div className={styles.gradeHeader}>
            <h4>Prelim</h4>
            <h4>Midterm</h4>
            <h4>Prefinal</h4>
            <h4>Final</h4>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.tableContent}>
          {allCourses.map((enrollment) => {
            const course = findDataById(courses, enrollment.courseId);
            const section = sections.find(
              (section) => section.courseId === course._id
            );
            const instructor = instructors.find(
              (instructor) => instructor.userId === section.instructorId
            );

            return (
              <div className={styles.tableItem}>
                <h3>{course?.description}</h3>
                <p>
                  {instructor?.firstName} {instructor?.lastName}
                </p>
                <div className={styles.gradeHeader}>
                  <p>{enrollment.prelim}</p>
                  <p>{enrollment.midterm}</p>
                  <p>{enrollment.prefinal}</p>
                  <p>{enrollment.final}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tabs = [
    {
      label: "All",
      content: <CourseView data={allCourses} type="all" />,
    },
    { label: "Core", content: <CourseView data={coreCourses} /> },
    { label: "Elective", content: <CourseView data={electiveCourses} /> },
  ];

  const allCoursesTabs = [
    {
      label: "First Semester",
      content: <GradeView />,
    },
    { label: "Second Semester", content: "2nd" },
  ];

  return (
    <Layout role="student" pageName="Courses">
      {sectionsLoading ||
      enrollmentsLoading ||
      coursesLoading ||
      instructorsLoading ? (
        <Loading />
      ) : (
        <div className={styles.contentDivider}>
          <aside className={styles.sideContent}>
            <section className={styles.courseView}>
              <div className={styles.alignCenter}>
                <h1>Courses</h1>
                <h2 className={styles.badge}>{studentEnrollments.length}</h2>
              </div>
              <TabMenu tabs={tabs} />
            </section>
          </aside>
          <main className={styles.mainContent}>
            <section className={styles.courseContent}>
              {selectedCourse ? (
                <ContentView />
              ) : (
                <>
                  <div className={styles.description}>
                    <h1 className={styles.title}>Overview</h1>
                    <p className={styles.desc}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempora illo nam, minus dolore modi beatae dolorem vitae
                      molestiae libero consectetur.
                    </p>
                  </div>
                  <div className={styles.card}>
                    <h3 className={styles.title}>Grades</h3>
                    <TabMenu tabs={allCoursesTabs} />
                  </div>
                  <div className={styles.card}>
                    <h3 className={styles.title}>Schedule</h3>
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      )}
    </Layout>
  );
};

export default Courses;

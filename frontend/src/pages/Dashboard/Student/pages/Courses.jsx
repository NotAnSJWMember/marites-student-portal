import React, { useEffect, useMemo, useState } from "react";
import styles from "./Courses.module.scss";

import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import TabMenu from "components/TabMenu/TabMenu";

import { useAuth } from "hooks";
import { useDataContext } from "hooks/contexts/DataContext";

import { findDataById } from "utils/findDataById";
import { findDataByUserId } from "utils/findDataByUserId";
import { findDataByCourseId } from "utils/findDataByCourseId";
import TimeTable from "components/Table/TimeTable";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: session } = useAuth();
  const { dataState: student } = useDataContext("student", session.userId);

  const { dataState: enrollments } = useDataContext("enrollment");
  const { dataState: schedules } = useDataContext("schedule");
  const { dataState: courses } = useDataContext("course");
  const { dataState: sections } = useDataContext("section");
  const { dataState: instructors } = useDataContext("instructor");

  useEffect(() => {
    if (student && enrollments && instructors && sections && courses) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [student, enrollments, instructors, sections, courses]);

  const studentEnrollments = enrollments?.filter((e) => e.studentId === student?.userId);

  const studentSchedules = schedules?.filter((s) =>
    studentEnrollments?.some((e) => e.scheduleId === s._id)
  );

  const [coreCourses, electiveCourses] = studentEnrollments.reduce(
    (acc, enrollment) => {
      enrollment.type === "core" ? acc[0].push(enrollment) : acc[1].push(enrollment);
      return acc;
    },
    [[], []]
  );

  const allCourses = [...coreCourses, ...electiveCourses];

  const handleSelectCourse = (courseId) => {
    setSelectedCourse((prev) =>
      prev?._id === courseId ? null : findDataById(courses, courseId)
    );
  };

  const CourseCard = ({ courseId, type }) => {
    const course = courses ? findDataById(courses, courseId) : null;
    const section = sections ? findDataByCourseId(sections, courseId) : null;
    const instructor = section ? findDataByUserId(instructors, section.instructorId) : null;

    const instructorName = instructor
      ? `${instructor.firstName} ${instructor.lastName}`
      : "Instructor not available";

    return (
      course && (
        <div
          key={course._id}
          className={`${styles.courseCard} ${
            course._id === selectedCourse?._id ? styles.selected : ""
          }`}
          onClick={() => handleSelectCourse(course._id)}
        >
          <div className={styles.courseInfo}>
            <p className={styles.title}>
              <strong>{course.description}</strong>
            </p>
            <p className={styles.desc}>
              {type !== "all"
                ? `${instructorName}`
                : coreCourses.some((course) => course.courseId === courseId)
                ? "Core"
                : "Elective"}
            </p>
          </div>
          <p className={styles.badge}>{course.code}</p>
        </div>
      )
    );
  };

  const CourseView = ({ data, type }) => {
    return data.map((course) => (
      <CourseCard key={course.courseId} courseId={course.courseId} type={type} />
    ));
  };

  const ContentView = () => {
    return (
      <div key={selectedCourse._id} className={styles.description}>
        <h2 className={styles.title}>{selectedCourse.description}</h2>
      </div>
    );
  };

  const GradeView = ({ semester }) => {
    const semesterCourses = allCourses
      ? allCourses.filter((e) => e.semester === semester)
      : null;

    return semesterCourses.length !== 0 ? (
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
          {semesterCourses.map((enrollment) => {
            const course = courses ? findDataById(courses, enrollment.courseId) : null;
            const section = sections ? findDataByCourseId(sections, course?._id) : null;
            const instructor = section
              ? findDataByUserId(instructors, section.instructorId)
              : null;

            const instructorName = instructor
              ? `${instructor.firstName} ${instructor.lastName}`
              : "Instructor not available";

            const checkAndFormatGrade = (grade) => {
              return grade !== 0 ? grade.toFixed(1) : "N/A";
            };

            return (
              course && (
                <div key={enrollment._id} className={styles.tableItem}>
                  <p><strong>{course.description}</strong></p>
                  <p>{instructorName}</p>
                  <div className={styles.gradeHeader}>
                    <p>{checkAndFormatGrade(enrollment.prelim)}</p>
                    <p>{checkAndFormatGrade(enrollment.midterm)}</p>
                    <p>{checkAndFormatGrade(enrollment.prefinal)}</p>
                    <p>{checkAndFormatGrade(enrollment.final)}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    ) : (
      <div>
        <p>You haven't been enrolled this semester.</p>
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
    { label: "1st Semester", content: <GradeView semester={1} /> },
    { label: "2nd Semester", content: <GradeView semester={2} /> },
  ];

  return (
    <Layout role="student" pageName="Courses">
      {allCourses.length !== 0 ? (
        <>
          <div className={styles.contentDivider}>
            <aside className={styles.sideContent}>
              <section className={styles.courseView}>
                <div className={styles.alignCenter}>
                  <h1>Courses</h1>
                  <p className={styles.badge}>
                    <strong>{studentEnrollments.length}</strong>
                  </p>
                </div>
                <TabMenu tabs={tabs} />
              </section>
            </aside>
            <main className={styles.mainContent}>
              <section className={styles.courseContent}>
                {selectedCourse ? (
                  <ContentView />
                ) : (
                  <div className={styles.description}>
                    <h2 className={styles.title}>Overview</h2>
                    <p className={styles.desc}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora illo
                      nam, minus dolore modi beatae dolorem vitae molestiae libero consectetur.
                    </p>
                  </div>
                )}
              </section>
              <section className={styles.card}>
                <h3 className={styles.title}>Grades</h3>
                <TabMenu tabs={allCoursesTabs} />
              </section>
              <section className={styles.card}>
                <h3 className={styles.title}>Schedule</h3>
                <TimeTable schedules={studentSchedules} />
              </section>
            </main>
          </div>
        </>
      ) : (
        <main className={styles.mainContent}>
          <section className={styles.emptyContent}>
            <div className={styles.info}>
              <h1 className={styles.title}>Oh snap!</h1>
              <p className={styles.desc}>It looks like you haven't been enrolled yet.</p>
            </div>
          </section>
        </main>
      )}
    </Layout>
  );
};

export default Courses;

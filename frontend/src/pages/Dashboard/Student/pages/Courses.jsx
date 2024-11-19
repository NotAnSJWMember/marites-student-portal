import React, { useEffect, useMemo } from "react";
import styles from "./Courses.module.scss";
import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";

import { useAuth } from "hooks";
import { useDataContext } from "hooks/contexts/DataContext";
import useFetchData from "hooks/useFetchData";

import { findDataById } from "utils/findDataById";
import { findDataByUserId } from "utils/findDataByUserId";

const Courses = () => {
  const { user: loggedInUser } = useAuth();

  const { data: enrollments } = useFetchData("enrollment");
  const { data: instructors } = useFetchData("instructor");
  const { data: sections } = useFetchData("section");
  const { data: user } = useFetchData(`student/${loggedInUser.userId}`);

  const { dataState: courses, loadingState, errorState } = useDataContext("course");

  const studentEnrollments = useMemo(
    () => enrollments.filter((e) => e.studentId === user?.userId),
    [enrollments, user]
  );

  const [coreCourses, electiveCourses] = useMemo(() => {
    const core = [];
    const elective = [];
    studentEnrollments.forEach((e) => {
      if (e.type === "core") core.push(e);
      if (e.type === "elective") elective.push(e);
    });
    return [core, elective];
  }, [studentEnrollments]);

  const CourseCard = ({ courseId }) => {
    const course = useMemo(() => findDataById(courses, courseId), [courseId]);
    const section = useMemo(() => sections.find((s) => s.courseId === courseId), [courseId]);
    const instructor = useMemo(
      () => findDataByUserId(instructors, section?.instructorId),
      [section]
    );
    if (!course) return null;
    return (
      <div key={course._id} className={styles.courseCard}>
        <div className={styles.courseInfo}>
          <h2 className={styles.title}>{course.description}</h2>
          <p className={styles.desc}>
            {instructor?.firstName} {instructor?.lastName}
          </p>
        </div>
        <h2 className={styles.badge}>{course.code}</h2>
      </div>
    );
  };

  const CourseView = ({ data }) => (
    <>
      {data.map((course) => (
        <CourseCard key={course.courseId} courseId={course.courseId} />
      ))}
    </>
  );

  const tabs = [
    { label: "All", content: "Coming Soon" },
    { label: "Core", content: <CourseView data={coreCourses} /> },
    { label: "Elective", content: <CourseView data={electiveCourses} /> },
  ];

  return (
    <Layout role="student" pageName="Courses">
      <div className={styles.contentDivider}>
        <aside className={styles.sideContent}>
          <section className={styles.courseView}>
            <div className={styles.iconLabel}>
              <h1>Courses</h1>
              <h2 className={styles.badge}>{studentEnrollments.length}</h2>
            </div>
            <TabMenu tabs={tabs} />
          </section>
        </aside>
        <main className={styles.mainContent}>
          <section className={styles.courseContent}></section>
        </main>
      </div>
    </Layout>
  );
};

export default Courses;

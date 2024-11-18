import React, { useMemo } from "react";
import styles from "./Courses.module.scss";
import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import useFetchData from "hooks/useFetchData";
import { useAuth } from "hooks";
import { findDataById } from "utils/findDataById";
import { capitalize } from "lodash";
import { findDataByUserId } from "utils/findDataByUserId";

const Courses = () => {
  const { user: loggedInUser } = useAuth();

  const { data: enrollments } = useFetchData("enrollment");
  const { data: courses } = useFetchData("course");
  const { data: instructors } = useFetchData("instructor");
  const { data: sections } = useFetchData("section");
  const { data: user } = useFetchData(`student/${loggedInUser.userId}`);

  const studentEnrollments = enrollments.filter((e) => e.studentId === user.userId);

  const CourseCard = ({ courseId }) => {
    const course = findDataById(courses, courseId);
    const section = sections.find((s) => s.courseId === courseId);
    const instructorId = section?.instructorId;
    const instructor = findDataByUserId(instructors, instructorId);

    return (
      course && (
        <div key={course._id} className={styles.courseCard}>
          <div className={styles.courseInfo}>
            <h2 className={styles.title}>{course.description}</h2>
            <p className={styles.desc}>
              {instructor?.firstName} {instructor?.lastName}
            </p>
          </div>
          <h2 className={styles.badge}>{course.code}</h2>
        </div>
      )
    );
  };

  const CoreView = ({ data }) => {
    return data.map((course) => {
      return <CourseCard key={course.courseId} courseId={course.courseId} type="core" />;
    });
  };
  const ElectiveView = () => {};

  const tabs = [
    { label: "All", content: "ngek" },
    { label: "Core", content: <CoreView data={studentEnrollments} /> },
    { label: "Elective", content: <ElectiveView /> },
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

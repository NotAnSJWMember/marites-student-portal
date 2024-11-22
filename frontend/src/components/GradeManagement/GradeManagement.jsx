import React, { useEffect, useState } from "react";
import styles from "./GradeManagement.module.scss";
import { TbCategoryFilled } from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import UserIcon from "components/ui/UserIcon/UserIcon";

import { formatDistanceToNow } from "date-fns";
import { useDataContext } from "hooks/contexts/DataContext";
import SearchBar from "components/SearchBar/SearchBar";
import { findDataById } from "utils/findDataById";
import { findDataByCourseId } from "utils/findDataByCourseId";
import { findDataByUserId } from "utils/findDataByUserId";

const GradeManagement = () => {
  const [loading, setIsLoading] = useState(true);
  const [editCategory, setEditCategory] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { dataState: students } = useDataContext("student");
  const { dataState: courses } = useDataContext("course");
  const { dataState: programs } = useDataContext("program");
  const { dataState: enrollments } = useDataContext("enrollment");

  useEffect(() => {
    if (students && courses && programs && enrollments) setIsLoading(false);
  }, [courses, programs, enrollments, students]);

  const handleCategoryChange = (category) => {
    if (category === "course") {
      setEditCategory({
        name: "course",
        data: courses,
      });
    } else if (category === "program") {
      setEditCategory({
        name: "program",
        data: programs,
      });
    }
  };

  const handleSelectionChange = (selectedId) => {
    if (editCategory.name === "course") {
      const enrolledStudentIds = enrollments
        .filter((enrollment) => enrollment.courseId === selectedId)
        .map((enrollment) => enrollment.studentId);

      const filtered = students.filter((student) => enrolledStudentIds.includes(student._id));
      setFilteredStudents(filtered);
    } else if (editCategory.name === "program") {
      const filtered = students.filter((student) => student.programId === selectedId);
      setFilteredStudents(filtered);
    }
  };

  const GradeView = ({ data }) => {
    console.log(data);
    

    return data.length !== 0 ? (
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h4>School ID</h4>
          <h4>Name</h4>
          <div className={styles.gradeHeader}>
            <h4>Prelim</h4>
            <h4>Midterm</h4>
            <h4>Prefinal</h4>
            <h4>Final</h4>
          </div>
        </div>
        <div className={styles.tableContent}>
          {data.map((student) => (
            <div key={student._id} className={styles.tableItem}>
              <p>
                <strong>07310316</strong>
              </p>
              <div className={styles.userContainer}>
                <UserIcon image={data.userPhoto} size={48} />
                <div className={styles.userInfo}>
                  <h4 className={styles.title}>{`${data.firstName} ${data.lastName}`}</h4>
                  <p className={styles.desc}>{data.email}</p>
                </div>
              </div>
              <div className={styles.gradeHeader}>
                <p>N/A</p>
                <p>N/A</p>
                <p>N/A</p>
                <p>N/A</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div>
        <p>No students found for the selected category.</p>
      </div>
    );
  };

  return (
    <Layout role="admin" pageName="Grade Management">
      {!loading ? (
        <>
          <div className={styles.contentDivider}>
            <main className={styles.mainContent}>
              <section className={styles.categoriesContainer}>
                <h2>Grade Categories</h2>
                <p>
                  Organize grades into specific categories (e.g., quizzes, exams, projects).
                </p>
                <button>Add Category</button>
              </section>
              <section className={styles.editContainer}>
                <div className={styles.spaceBetween}>
                  <h2>Grade Editing</h2>
                  <div className={styles.buttonContainer}>
                    <p>
                      <strong>Category:</strong>
                    </p>
                    <button
                      type="button"
                      className={`${styles.secondaryBtn} ${
                        editCategory.name === "course" ? styles.active : ""
                      }`}
                      onClick={() => handleCategoryChange("course")}
                    >
                      Course
                    </button>
                    <button
                      type="button"
                      className={`${styles.secondaryBtn} ${
                        editCategory.name === "program" ? styles.active : ""
                      }`}
                      onClick={() => handleCategoryChange("program")}
                    >
                      Program
                    </button>
                    {editCategory.data && (
                      <select
                        className={styles.select}
                        onChange={(e) => handleSelectionChange(e.target.value)}
                      >
                        <option value="">Select {editCategory.name}</option>
                        {editCategory.data.map((option) => (
                          <option key={option._id} value={option._id}>
                            {option.description}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <SearchBar height={45} />
                <div className={styles.gradeContent}>
                  <GradeView data={filteredStudents} />
                </div>
              </section>
            </main>
            <aside className={styles.sideContent}>
              <section className={styles.requestsContainer}>
                <h2>Grade Edit Requests</h2>
                <p>Manage requests for grade changes submitted by instructors.</p>
                <ul>
                  <li>Request #1: Change grade for John Doe in Course A (Pending)</li>
                </ul>
              </section>
              <section className={styles.guidelinesContainer}>
                <h2>Grade Editing Guidelines</h2>
                <p>
                  Please follow the provided guidelines when editing grades to ensure data
                  accuracy and compliance with institutional policies.
                </p>
                <ol>
                  <li>Always double-check the student ID before making changes.</li>
                  <li>Ensure grades are updated within the allowed timeframe.</li>
                  <li>Submit grade changes for approval when required.</li>
                </ol>
              </section>
            </aside>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

/* <section className={styles.reportsContainer}>
          <h2>Grade Reports</h2>
          <p>Export data based on course, program, section, or individual student.</p>
          <div className={styles.exportButtons}>
            <button>Export by Course</button>
            <button>Export by Section</button>
            <button>Export by Program</button>
            <button>Export Individual Grade Sheet</button>
          </div>
        </section> */

export default GradeManagement;

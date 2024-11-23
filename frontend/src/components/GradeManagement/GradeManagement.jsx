import React, { useEffect, useMemo, useState } from "react";
import styles from "./GradeManagement.module.scss";
import { TbDotsVertical } from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import UserIcon from "components/ui/UserIcon/UserIcon";

import { useDataContext } from "hooks/contexts/DataContext";
import SearchBar from "components/SearchBar/SearchBar";
import Popup from "components/Popup/Popup";
import TabMenu from "components/TabMenu/TabMenu";
import { usePopupAlert } from "hooks";
import PopupAlert from "components/Popup/PopupAlert";
import usePostData from "hooks/usePostData";
import useFetchData from "hooks/useFetchData";
import useUpdateData from "hooks/useUpdateData";

const GradeManagement = () => {
  const [loading, setIsLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { dataState: students } = useDataContext("student");
  const { dataState: courses } = useDataContext("course");
  const { dataState: programs } = useDataContext("program");
  const { data: enrollments, fetchData } = useFetchData("enrollment");

  const { popupState, showPopup, showError } = usePopupAlert();
  const {
    popupState: updatePopup,
    showPopup: showUpdatePopup,
    setShowPopup: setShowUpdatePopup,
    loading: updateLoading,
    updateData,
  } = useUpdateData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (students && courses && programs && enrollments) {
      setIsLoading(false);
      setFilteredData(students);
    }
  }, [students, courses, programs, enrollments]);

  const formatGrade = (grade) => (grade !== 0 ? grade.toFixed(1) : "N/A");

  const calculateAverageGrade = (enrollments) => {
    const grades = enrollments.flatMap(({ prelim, midterm, prefinal, final }) =>
      [prelim, midterm, prefinal, final].filter(Boolean)
    );
    return grades.length
      ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1)
      : "N/A";
  };

  const handleSavedGrades = (data) => {
    const enrollments = data.map((e) => ({
      _id: e._id,
      grades: {
        prelim: e.prelim,
        midterm: e.midterm,
        prefinal: e.prefinal,
        final: e.final,
      },
    }));

    const body = {
      enrollments: enrollments,
    };

    const response = updateData(body, `enrollment/update-grades`, null, fetchData);
    if (response.ok) setShowUpdatePopup(true);
  };

  const handleCategoryChange = (category) => {
    if (category === "all") {
      setSelectedCategory("all");
      setSelectedOption("");
      setFilteredData(students);
    } else {
      setSelectedCategory(category);
      setSelectedOption("");
      setFilteredData([]);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);

    if (selectedCategory === "course") {
      const enrolledStudentIds = enrollments
        .filter((enrollment) => enrollment.courseId === optionId)
        .map((enrollment) => enrollment.studentId);

      const courseStudents = students.filter((student) =>
        enrolledStudentIds.includes(student.userId)
      );
      setFilteredData(courseStudents);
    } else if (selectedCategory === "program") {
      const programStudents = students.filter((student) => student.programId === optionId);
      setFilteredData(programStudents);
    }
  };

  const handleOpenPopup = (studentId) => {
    const student = students.find((student) => student.userId === studentId);
    if (student) setPopupData(student);
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  const StudentGradeView = ({ data }) => {
    const memoizedData = useMemo(() => data, [data]);

    const [editingGrade, setEditingGrade] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const [grades, setGrades] = useState(memoizedData);

    const handleDoubleClick = (enrollmentId, gradeType, currentGrade) => {
      setEditingGrade({ enrollmentId, gradeType });
      setEditedValue(currentGrade);
    };

    const handleGradeChange = (e) => {
      setEditedValue(e.target.value);
    };

    const handleSave = () => {
      const grade = parseFloat(editedValue);

      if (isNaN(grade) || grade < 0.0 || grade > 5.0) {
        showError("Invalid grade", "Grade must be between 0.0 and 5.0.");
        return;
      }

      const updatedGrades = grades.map((enrollment) => {
        if (enrollment._id === editingGrade.enrollmentId) {
          return {
            ...enrollment,
            [editingGrade.gradeType]: grade,
          };
        }
        return enrollment;
      });

      setGrades(updatedGrades);
      setEditingGrade(null);
    };

    const handleBlur = () => {
      setEditingGrade(null);
    };

    return grades.length !== 0 ? (
      <>
        <div className={styles.tableWrapper}>
          <div
            className={styles.tableHeader}
            style={{ gridTemplateColumns: "100px 200px 1fr" }}
          >
            <h4>Code</h4>
            <h4>Course</h4>
            <div className={styles.gradeHeader}>
              <h4>Prelim</h4>
              <h4>Midterm</h4>
              <h4>Prefinal</h4>
              <h4>Final</h4>
            </div>
          </div>
          <div className={styles.tableContent}>
            {grades.map((enrollment) => {
              const course = courses
                ? courses.find((c) => c._id === enrollment.courseId)
                : null;

              return (
                <div
                  key={course._id}
                  className={styles.tableItem}
                  style={{ gridTemplateColumns: "100px 200px 1fr" }}
                >
                  <p>{course.code}</p>
                  <p>{course.description}</p>
                  <div className={styles.gradeHeader}>
                    {["prelim", "midterm", "prefinal", "final"].map((gradeType) => {
                      const grade = enrollment[gradeType];
                      return (
                        <p
                          key={gradeType}
                          className={styles.gradeItem}
                          onDoubleClick={() =>
                            handleDoubleClick(enrollment._id, gradeType, grade)
                          }
                        >
                          {editingGrade &&
                          editingGrade.enrollmentId === enrollment._id &&
                          editingGrade.gradeType === gradeType ? (
                            <input
                              type="number"
                              onChange={handleGradeChange}
                              onBlur={handleBlur}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSave();
                                }
                              }}
                              autoFocus
                              placeholder={grade}
                            />
                          ) : (
                            formatGrade(parseFloat(grade))
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClosePopup} className={styles.secondaryBtn}>
            Close
          </button>
          <button onClick={() => handleSavedGrades(grades)} className={styles.primaryBtn}>
            Save changes
            {updateLoading && <Loading />}
          </button>
        </div>
      </>
    ) : (
      <p>This student hasn't been enrolled in this semester.</p>
    );
  };

  const GradeView = ({ data }) => {
    if (!data || data.length === 0) {
      return <p>No students found for the selected category.</p>;
    }

    return (
      <div className={styles.tableWrapper}>
        <div
          className={styles.tableHeader}
          style={
            selectedCategory === "all"
              ? { gridTemplateColumns: "120px 1fr 1fr 1fr 40px" }
              : { gridTemplateColumns: "120px 1fr 1fr 40px" }
          }
        >
          <h4>School ID</h4>
          <h4>Name</h4>
          {selectedCategory === "all" && (
            <>
              <h4>Program</h4>
              <h4>Average Grade</h4>
            </>
          )}
          {selectedCategory === "course" && (
            <div className={styles.gradeHeader}>
              <h4>Prelim</h4>
              <h4>Midterm</h4>
              <h4>Prefinal</h4>
              <h4>Final</h4>
            </div>
          )}
          {selectedCategory === "program" && <h4>Average Grade</h4>}
        </div>
        <div className={styles.tableContent}>
          {data.map((student) => {
            const studentEnrollments = enrollments.filter(
              (enrollment) => enrollment.studentId === student.userId
            );
            const courseGrades =
              selectedCategory === "course" &&
              studentEnrollments.find((enrollment) => enrollment.courseId === selectedOption);

            const program = programs
              ? programs.find((p) => p._id === student.programId)
              : "No program";

            return (
              <div
                key={student._id}
                className={styles.tableItem}
                style={
                  selectedCategory === "all"
                    ? { gridTemplateColumns: "120px 1fr 1fr 1fr 40px" }
                    : { gridTemplateColumns: "120px 1fr 1fr 40px" }
                }
              >
                <p className={styles.badge}>
                  <strong>{student.userId}</strong>
                </p>
                <div className={styles.userContainer}>
                  <UserIcon image={student.userPhoto} size={48} />
                  <div className={styles.userInfo}>
                    <h4 className={styles.title}>
                      {`${student.firstName} ${student.lastName}`}
                    </h4>
                    <p className={styles.desc}>{student.email}</p>
                  </div>
                </div>
                {selectedCategory === "all" && (
                  <p>
                    {program?.code ? `${program.code} - ${student.yearLevel}` : "No Program"}
                  </p>
                )}
                {selectedCategory === "course" ? (
                  <div className={styles.gradeHeader}>
                    <p>{formatGrade(courseGrades?.prelim)}</p>
                    <p>{formatGrade(courseGrades?.midterm)}</p>
                    <p>{formatGrade(courseGrades?.prefinal)}</p>
                    <p>{formatGrade(courseGrades?.final)}</p>
                  </div>
                ) : (
                  <p>{calculateAverageGrade(studentEnrollments)}</p>
                )}
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.iconBtn}`}
                  onClick={() => handleOpenPopup(student.userId)}
                >
                  <TbDotsVertical size={IconSizes.MEDIUM} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEditPopup = () => {
    const studentEnrollments = enrollments
      ? enrollments.filter((e) => e.studentId === popupData.userId)
      : [];

    return (
      <Popup show={!!popupData} close={handleClosePopup} position="center">
        <div className={styles.popupWrapper}>
          <div className={styles.studentInfo}>
            <h3>{`${popupData.firstName} ${popupData.lastName}`}</h3>
            <p>{popupData.email}</p>
            <p>{popupData.userId}</p>
          </div>
          <div className={styles.contentContainer}>
            <TabMenu
              tabs={[
                {
                  label: "1st Semester",
                  content: (
                    <StudentGradeView
                      data={studentEnrollments.filter(
                        (enrollment) => enrollment.semester === 1
                      )}
                      semester={1}
                    />
                  ),
                },
                {
                  label: "2nd Semester",
                  content: (
                    <StudentGradeView
                      data={studentEnrollments.filter(
                        (enrollment) => enrollment.semester === 2
                      )}
                      semester={2}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <Layout role="admin" pageName="Grade Management">
      {!loading ? (
        <div className={styles.contentDivider}>
          <main className={styles.mainContent}>
            <section className={styles.editContainer}>
              <div className={styles.spaceBetween}>
                <h2>Edit Grades</h2>
                <div className={styles.buttonContainer}>
                  <p>
                    <strong>Category:</strong>
                  </p>
                  <button
                    type="button"
                    className={`${styles.secondaryBtn} ${
                      selectedCategory === "all" ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange("all")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`${styles.secondaryBtn} ${
                      selectedCategory === "course" ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange("course")}
                  >
                    Course
                  </button>
                  <button
                    type="button"
                    className={`${styles.secondaryBtn} ${
                      selectedCategory === "program" ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange("program")}
                  >
                    Program
                  </button>
                  <select
                    className={styles.select}
                    value={selectedOption}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    style={
                      selectedCategory === "all"
                        ? { cursor: "not-allowed" }
                        : { cursor: "pointer" }
                    }
                    disabled={selectedCategory === "all"}
                  >
                    <option value="">Select {selectedCategory}</option>
                    {(selectedCategory === "course" ? courses : programs).map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <SearchBar height={45} />
              <GradeView data={filteredData} />
            </section>
          </main>
          <aside className={styles.sideContent}>
            <section className={styles.requestsContainer}>
              <h3>Requests</h3>
              <p>Manage requests for grade changes submitted by instructors.</p>
              <ul>
                <li>Request #1: Change grade for John Doe in Course A (Pending)</li>
              </ul>
            </section>
            <section className={styles.guidelinesContainer}>
              <h3>Guidelines</h3>
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
      ) : (
        <Loading />
      )}
      {popupData && renderEditPopup()}
      <PopupAlert
        icon={updatePopup.icon}
        title={updatePopup.title}
        message={updatePopup.message}
        color={updatePopup.color}
        border={updatePopup.border}
        show={showUpdatePopup}
      />
      <PopupAlert
        icon={popupState.icon}
        title={popupState.title}
        message={popupState.message}
        color={popupState.color}
        border={popupState.border}
        show={showPopup}
      />
    </Layout>
  );
};

export default GradeManagement;

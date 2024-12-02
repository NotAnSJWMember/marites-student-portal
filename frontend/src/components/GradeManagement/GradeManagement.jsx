import React, { useEffect, useMemo, useState } from "react";
import styles from "./GradeManagement.module.scss";
import { TbDotsVertical, TbId } from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";

import { useDataContext } from "hooks/contexts/DataContext";
import SearchBar from "components/SearchBar/SearchBar";
import Popup from "components/Popup/Popup";
import TabMenu from "components/TabMenu/TabMenu";
import { usePopupAlert } from "hooks";
import PopupAlert from "components/Popup/PopupAlert";
import useFetchData from "hooks/useFetchData";
import useUpdateData from "hooks/useUpdateData";
import { FormSelect } from "components/ui/Form";
import { UserContainer } from "components/ui/UserContainer/UserContainer";

const GradeManagement = () => {
  const [loading, setIsLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
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

  const programOptions = useMemo(() => {
    return programs.map((p) => {
      const label = p.description.replace(/Bachelor of (Science|Arts) in /, "");

      return {
        value: p._id,
        label,
      };
    });
  }, [programs]);

  const courseOptions = useMemo(() => {
    return courses.map((c) => {
      return {
        value: c._id,
        label: c.description,
      };
    });
  }, [courses]);

  useEffect(() => {
    if (students && courses && programs && enrollments) {
      setIsLoading(false);

      const studentEnrollments = students.map((student) => {
        const enrollmentsForStudent = enrollments.filter(
          (e) => e.studentId === student.userId
        );
        return {
          student,
          enrollments: enrollmentsForStudent,
        };
      });

      const enrolledStudents = studentEnrollments.filter(
        (student) => student.enrollments.length !== 0
      );
      setInitialData(enrolledStudents);
      setFilteredData(enrolledStudents);
    }
  }, [students, courses, programs, enrollments]);

  const formatGrade = (grade) => (grade !== 0 ? grade?.toFixed(1) : "N/A");

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
      setSelectedOption(null);
      setFilteredData(initialData);
    } else {
      setSelectedCategory(category);
      setSelectedOption(null);
      setFilteredData([]);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);

    if (selectedCategory === "course") {
      const enrolledStudents = initialData.map((item) => {
        const enrollment = item.enrollments
          .filter((e) => e.courseId === optionId.value)
          .find((e) => e.studentId);

        return {
          student: item.student,
          enrollments: enrollment,
        };
      });

      const filteredStudents = enrolledStudents.filter(
        (item) => item.enrollments !== undefined
      );

      setFilteredData(filteredStudents);
    } else if (selectedCategory === "program") {
      // const programStudents = enrolledStudentData.filter(
      //   (student) => student.programId === optionId.value
      // );
      // setFilteredData(programStudents);
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
    const [editingGrade, setEditingGrade] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const [grades, setGrades] = useState(data);

    useEffect(() => {
      setGrades(data);
    }, [data]);

    const handleClick = (enrollmentId, gradeType, currentGrade) => {
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

    return (
      <>
        {grades.length !== 0 ? (
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
                    <p>
                      <strong>{course.code}</strong>
                    </p>
                    <p>{course.description}</p>
                    <div className={styles.gradeHeader}>
                      {["prelim", "midterm", "prefinal", "final"].map((gradeType) => {
                        const grade = enrollment[gradeType];
                        return (
                          <p
                            key={gradeType}
                            className={styles.gradeItem}
                            onClick={() => handleClick(enrollment._id, gradeType, grade)}
                          >
                            {editingGrade &&
                            editingGrade.enrollmentId === enrollment._id &&
                            editingGrade.gradeType === gradeType ? (
                              <input
                                type="number"
                                onChange={handleGradeChange}
                                onBlur={handleSave}
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
        ) : (
          <p>This student hasn't been enrolled in this semester.</p>
        )}
        <div className={styles.buttonContainer}>
          <button onClick={handleClosePopup} className={styles.secondaryBtn}>
            Close
          </button>
          {grades.length !== 0 && (
            <button
              onClick={() => handleSavedGrades(grades)}
              className={styles.primaryBtn}
            >
              Save changes
              {updateLoading && <Loading />}
            </button>
          )}
        </div>
      </>
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
          {data.map((item) => {
            const student = item.student;
            const studentEnrollments = item.enrollments;

            const program =
              selectedCategory === "program" &&
              programs.find((p) => p._id === student.programId);

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
                <UserContainer user={student} size={48} />
                {selectedCategory === "all" && (
                  <p>
                    {program?.code
                      ? `${program.code} - ${student.yearLevel}`
                      : "No Program"}
                  </p>
                )}
                {selectedCategory === "course" ? (
                  <div className={styles.gradeHeader}>
                    <p>{formatGrade(studentEnrollments.prelim)}</p>
                    <p>{formatGrade(studentEnrollments.midterm)}</p>
                    <p>{formatGrade(studentEnrollments.prefinal)}</p>
                    <p>{formatGrade(studentEnrollments.final)}</p>
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
    const data = filteredData.find((item) => item.student.userId === popupData.userId);

    return (
      <Popup show={!!popupData} close={handleClosePopup} position="center">
        <div className={styles.popupWrapper}>
          <div className={styles.studentInfo}>
            <UserContainer user={popupData} size={70} />
            <div className={styles.iconBadge}>
              <TbId size={IconSizes.SMALL} />
              <p>{data.student.userId}</p>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <TabMenu
              tabs={[
                {
                  label: "1st Semester",
                  content: (
                    <StudentGradeView
                      data={data.enrollments.filter(
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
                      data={data.enrollments.filter(
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

  useEffect(() => {
    console.log("Current data: ", filteredData);
  });

  return (
    <Layout role="admin" pageName="Grade Management">
      {!loading ? (
        <div className={styles.contentDivider}>
          <main className={styles.mainContent}>
            <section className={styles.editContainer}>
              <div className={styles.spaceBetween}>
                <h2>Grade Management</h2>
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
                    disabled={selectedCategory === "all"}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`${styles.secondaryBtn} ${
                      selectedCategory === "course" ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange("course")}
                    disabled={selectedCategory === "course"}
                  >
                    Course
                  </button>
                  <button
                    type="button"
                    className={`${styles.secondaryBtn} ${
                      selectedCategory === "program" ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange("program")}
                    disabled={selectedCategory === "program"}
                  >
                    Program
                  </button>
                  <FormSelect
                    name={selectedCategory}
                    options={
                      selectedCategory === "course" ? courseOptions : programOptions
                    }
                    width="17rem"
                    selectedData={selectedOption}
                    setSelectedData={handleOptionChange}
                    searchBar={true}
                    disabled={selectedCategory === "all"}
                  />
                </div>
              </div>
              <SearchBar
                data={students}
                onSearch={setSearchData}
                height={45}
                placeholder="Search for students with their ID or name"
              />
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

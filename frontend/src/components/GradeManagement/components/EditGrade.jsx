import React, { useEffect, useState } from "react";
import styles from "../GradeManagement.module.scss";
import { formatGrade } from "utils/formatGrade";
import Loading from "components/Loading/Loading";

const EditGrade = ({
  data,
  courses,
  updateLoading,
  handleSavedGrades,
  handleClosePopup,
  showError,
}) => {
  const [editingGrade, setEditingGrade] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [grades, setGrades] = useState(data);

  useEffect(() => {
    setTimeout(() => {
      setGrades(data);
    }, 150);
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
          <button onClick={() => handleSavedGrades(grades)} className={styles.primaryBtn}>
            Save changes
            {updateLoading && <Loading />}
          </button>
        )}
      </div>
    </>
  );
};

export default EditGrade;

import React from "react";
import styles from "../GradeManagement.module.scss";
import IconSizes from "constants/IconSizes";
import { TbDotsVertical, TbMoodPuzzled } from "react-icons/tb";
import { MessageInfo } from "components/ui/Message/MessageInfo";
import { UserContainer } from "components/ui/UserContainer/UserContainer";
import { formatGrade } from "utils/formatGrade";
import { calculateAverageGrade } from "utils/calculateAverageGrade";

const Table = ({ data, programs, handleOpenPopup, selectedCategory, selectedOption }) => {
  const gridTemplates = {
    all: "120px 1fr 1fr 1fr 40px",
    program: "120px 1fr 1fr 40px",
    course: "120px 1fr 1fr 40px",
  };
  const gridStyle = {
    gridTemplateColumns: gridTemplates[selectedCategory] || gridTemplates.all,
  };

  if (selectedCategory !== "all" && selectedOption[selectedCategory] === null) {
    return (
      <MessageInfo
        title={`No option selected for ${selectedCategory}`}
        message="It seems you haven't selected an option for the current category. Please select one to view relevant data."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContent}>
        <TbMoodPuzzled size={120} />
        <h3 className={styles.title}>Uh-oh, no students here!</h3>
        <p className={styles.desc}>
          Looks like we couldn't find any students for the selected category.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader} style={gridStyle}>
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

          const program = programs.find((p) => p._id === student.programId);

          return (
            <div key={student._id} className={styles.tableItem} style={gridStyle}>
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
                  <p>{formatGrade(studentEnrollments[0].prelim)}</p>
                  <p>{formatGrade(studentEnrollments[0].midterm)}</p>
                  <p>{formatGrade(studentEnrollments[0].prefinal)}</p>
                  <p>{formatGrade(studentEnrollments[0].final)}</p>
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

export default Table;

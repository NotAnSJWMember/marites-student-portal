import React, { useEffect } from "react";
import styles from "./FormUser.module.scss";

import { FormSelect } from "components/ui/Form";

export const FormStudent = ({
  userData,
  programOptions,
  yearOptions,
  selectedProgram,
  setSelectedProgram,
  selectedYearLevel,
  setSelectedYearLevel,
}) => {
  useEffect(() => {
    if (!selectedProgram && userData.programId) {
      const programId = programOptions.find(
        (program) => program.value === userData.programId
      );
      if (programId) setSelectedProgram(programId);
    }

    if (!selectedYearLevel && userData.yearLevel) {
      const yearLevel = yearOptions.find(
        (option) => option.value === parseInt(userData.yearLevel)
      );
      if (yearLevel) setSelectedYearLevel(yearLevel);
    }
  }, [
    userData,
    programOptions,
    yearOptions,
    selectedProgram,
    selectedYearLevel,
    setSelectedProgram,
    setSelectedYearLevel,
  ]);

  return (
    <div className={styles.twoColumn}>
      <h4>Program</h4>
      <div className={styles.twoColumn}>
        <FormSelect
          name="program"
          options={programOptions}
          setSelectedData={setSelectedProgram}
          selectedData={selectedProgram}
        />
        <FormSelect
          name="year"
          options={yearOptions}
          setSelectedData={setSelectedYearLevel}
          selectedData={selectedYearLevel}
        />
      </div>
    </div>
  );
};

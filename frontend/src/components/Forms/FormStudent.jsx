import React, { useState, useMemo, useEffect } from "react";
import styles from "./FormUser.module.scss";

import { FormSelect } from "components/ui/Form";

import { useDataContext } from "hooks/contexts/DataContext";

export const FormStudent = ({ setValue, userData = {}, register, errors }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    setValue("programId", userData.programId)
    setValue("yearLevel", userData.yearLevel)
  });

  const { dataState: programs } = useDataContext("program");

  const yearOptions = useMemo(() => {
    const baseOptions = [
      { value: 1, label: "First Year" },
      { value: 2, label: "Second Year" },
      { value: 3, label: "Third Year" },
      { value: 4, label: "Fourth Year" },
    ];
    if (selectedProgram?.duration === 5) {
      baseOptions.push({ value: 5, label: "Fifth Year" });
    }
    return baseOptions;
  }, [selectedProgram]);

  const handleProgramChange = (event) => {
    const program = programs.find((p) => p._id === event.target.value);
    setSelectedProgram(program);
  };

  return (
    <div className={styles.twoColumn}>
      <h4>Program</h4>
      <div className={styles.twoColumn}>
        <FormSelect
          name="program"
          value="programId"
          options={programs.map((program) => ({
            value: program._id,
            label: program.description.replace("Bachelor of Science in", ""),
          }))}
          register={register}
          onChange={handleProgramChange}
          errors={errors}
        />
        <FormSelect
          name="year"
          value="yearLevel"
          options={yearOptions}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
};

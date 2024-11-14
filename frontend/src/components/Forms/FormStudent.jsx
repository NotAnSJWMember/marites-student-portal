import React, { useState, useMemo } from "react";
import Loading from "components/Loading/Loading";
import { FormSelect } from "components/ui/Form";
import { usePopupAlert } from "hooks";
import useFetchData from "hooks/useFetchData";
import styles from "./FormUser.module.scss";

export const FormStudent = ({ register, onBack }) => {
   const [selectedProgram, setSelectedProgram] = useState(null);
   const { showError } = usePopupAlert();

   const token = localStorage.getItem("token");
   const { data: programs, loading, error } = useFetchData("program");

   const yearOptions = useMemo(() => {
      const baseOptions = [
         { value: "1", label: "First Year" },
         { value: "2", label: "Second Year" },
         { value: "3", label: "Third Year" },
         { value: "4", label: "Fourth Year" },
      ];
      if (selectedProgram?.duration === 5) {
         baseOptions.push({ value: "5", label: "Fifth Year" });
      }
      return baseOptions;
   }, [selectedProgram]);

   const handleProgramChange = (event) => {
      const program = programs.find((p) => p._id === event.target.value);
      setSelectedProgram(program);
   };

   if (loading) return <Loading />;
   if (error) showError("Oops! Something went wrong", error);

   return (
      <div className={styles.twoColumn}>
         <h4>Program</h4>
         <div className={styles.twoColumn}>
            <FormSelect
               name="program"
               value="programId"
               options={programs.map((program) => ({
                  value: program._id,
                  label: program.description,
               }))}
               register={register}
               onChange={handleProgramChange}
            />
            <FormSelect
               name="year"
               value="yearLevel"
               options={yearOptions}
               register={register}
            />
         </div>
      </div>
   );
};

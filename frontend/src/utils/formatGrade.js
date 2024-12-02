export const formatGrade = (grade) => {
  return grade !== 0 ? grade?.toFixed(1) : "N/A";
};

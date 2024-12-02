export const calculateAverageGrade = (enrollments) => {
  const grades = enrollments.flatMap(({ prelim, midterm, prefinal, final }) =>
    [prelim, midterm, prefinal, final].filter(Boolean)
  );
  return grades.length
    ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1)
    : "N/A";
};

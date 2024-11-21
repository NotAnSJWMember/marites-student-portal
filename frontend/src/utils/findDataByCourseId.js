export const findDataByCourseId = (data, id) => {
  return data.find((data) => data.courseId === id) || {};
};

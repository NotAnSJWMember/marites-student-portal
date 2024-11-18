export const findDataByUserId = (data, id) => {
  return data.find((data) => data.userId === id) || null;
};

export const findDataById = (data, id) => {
  return data.find((data) => data._id === id) || null;
};

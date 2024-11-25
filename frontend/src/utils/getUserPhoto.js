import { getApiUrl } from "./api";

export const getUserPhoto = (userPhoto) => {
  const userPhotoUrl = `${getApiUrl()}/${userPhoto}`;
  return userPhotoUrl;
};

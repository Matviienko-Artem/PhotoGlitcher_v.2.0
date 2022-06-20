import axios from "axios";
// const ACCESS = process.env.REACT_APP_ACCESS_KEY;
const count = 30;

export const fetchRandomImage = (searchQuery = "", accesKey) => {
  return axios
    .get(
      `https://api.unsplash.com/photos/random/?query=${searchQuery}&client_id=${accesKey}&count=${count}`
    )
    .then(({ data }) => data);
};

// export const fetchById = (searchQuery = "") => {
//   return axios
//     .get(
//       `https://api.unsplash.com/photos/${searchQuery}/?per_page=1&client_id=${ACCESS}`
//     )
//     .then(({ data }) => data);
// };

// export const fetchByUsername = (searchQuery = "") => {
//   return axios
//     .get(
//       `https://api.unsplash.com/users/${searchQuery}/collections/?per_page=1&client_id=${ACCESS}`
//     )
//     .then(({ data }) => data);
// };

import axios from "axios";

export const postImage = ({ src, id }) => {
  return axios
    .post("http://localhost:8080/img", { data: src.toString(), id: id })
    .then((res) => console.log(res.data))
    .catch((err) => alert(err));
};

import axios from "axios";

export default axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}/api/datapre/addDataset`,
  headers: {
    "Content-type": "application/json",
  },
});

import http from "../http-common";

const upload = (formData, file, onUploadProgress) => {  

  //formData.append("file", file);
  console.log("uploaded with FileUploadService")
  // console.log(project_id['param1'])
  //console.log(global.agent.axios.defaults.headers.common[`SM-AUTH-TOKEN`])

  return http.post(null, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "SM-AUTH-TOKEN": global.agent.axios.defaults.headers.common[`SM-AUTH-TOKEN`],
    },
    // params:{project_id:project_id['param1']},
    onUploadProgress,
  });
};

const getFiles = () => {
  return http.get("/files");
};

export default {
  upload,
  getFiles,
};

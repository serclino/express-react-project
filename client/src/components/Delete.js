import React from "react";
import Axios from "axios";

export const Delete = ({ setBackendData, setFile }) => {
  const deleteFile = () => {
    Axios({
      url: "/delete",
      method: "DELETE",
    }).then((res) => {
      document.querySelector(".chooseFile").value = "";
      setBackendData([]);
      setFile(null);
      alert(res.data);
    });
  };

  return (
    <button type="button" onClick={deleteFile}>
      Delete file
    </button>
  );
};

import React from "react";
import Axios from "axios";
import { Delete } from "./Delete";

export const Upload = ({
  file,
  setFile,
  backendData,
  setBackendData,
  setTotalHours,
  setWagePerHour,
}) => {
  const handleFile = (e) => {
    let file = e.target.files[0];
    setFile(file);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("csv", file, "file.csv");
    Axios({
      url: "/data",
      method: "POST",
      data: formdata,
    })
      .then((res) => {
        setBackendData(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
    // reset state of the app to default when new file occurs
    setTotalHours(0);
    setWagePerHour(0);
    Array.from(document.querySelectorAll("input[type=radio]:checked")).map(
      (input) => (input.checked = false)
    );
    const inputJine = Array.from(
      document.querySelectorAll("input[type=number]")
    );
    inputJine.pop(); // necessary line, otherwise input for wage will disapper
    inputJine.map((input) => {
      input.value = 0;
      input.type = "hidden";
      return undefined;
    });
  };

  return (
    <form onSubmit={(e) => handleUpload(e)}>
      <p>Nahrání nového souboru způsobí, že se přepíšou data.</p>
      <label style={{marginRight: '10px'}}>Soubor:</label>
      <input
        accept=".csv"
        className="chooseFile"
        type="file"
        name="file"
        onChange={(e) => handleFile(e)}
      />
      <button type="submit" style={{marginRight: '10px'}}>Upload</button>
      {backendData.length > 0 && (
        <Delete setBackendData={setBackendData} setFile={setFile} />
      )}
    </form>
  );
};

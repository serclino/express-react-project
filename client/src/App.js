import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";

const App = () => {
  const [backendData, setBackendData] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    Axios({
      url: "/data",
      method: "GET",
    }).then((res) => {
      setBackendData(res.data);
    });
  }, []);

  const handleFile = (e) => {
    // console.log(e.target.files[0]);
    let file = e.target.files[0];
    setFile(file);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // console.log(file);
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
      });
  };

  const handleCheck = (e, uniqueId) => {
    // first deselect last input in the row if it is already selected
    const lastInput = document.getElementById(`lastInput-${uniqueId}`);
    if ((lastInput.type = "number")) {
      lastInput.type = "hidden";
      lastInput.value = "";
    }
    // add input hours to totalHours
  };

  return (
    <div>
      <h1>CSV File Upload</h1>
      <form onSubmit={(e) => handleUpload(e)}>
        <p>Nahrání nového souboru způsobí, že se přemažou data.</p>
        <label>Select File</label>
        <input type="file" name="file" onChange={(e) => handleFile(e)} />
        <button type="submit">Upload</button>
      </form>

      {backendData.length > 0 && (
        <table>
          <thead>
            <tr>
              {backendData[0]?.map((header, id) => {
                return <th key={id}>{header}</th>;
              })}
              <th>Jiné</th>
            </tr>
          </thead>
          <tbody>
            {backendData.map((row, id) => {
              if (id === 0) {
                return null;
              }
              const uniqueId = `${id}-row`;
              return (
                <tr key={id}>
                  {row.map((cell, id) => {
                    if (id === 0) {
                      return (
                        <td key={id}>
                          <form id={uniqueId}>{cell}</form>
                        </td>
                      );
                    } else {
                      return (
                        <td key={id}>
                          <input
                            type="radio"
                            form={uniqueId}
                            value={cell}
                            name={uniqueId}
                            onClick={(e) => handleCheck(e, uniqueId)}
                            disabled={!cell}
                          />
                          <label htmlFor={cell}>{cell}</label>
                        </td>
                      );
                    }
                  })}
                  <td>
                    <input
                      type="radio"
                      form={uniqueId}
                      name={uniqueId}
                      value=""
                      onClick={(e) =>
                        (document.getElementById(`lastInput-${uniqueId}`).type =
                          "number")
                      }
                    />
                    <input
                      type="hidden"
                      name={uniqueId}
                      id={`lastInput-${uniqueId}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;

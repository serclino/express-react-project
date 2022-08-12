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
        console.log("response:", res);
        setBackendData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>CSV File Upload</h1>
      <form onSubmit={(e) => handleUpload(e)}>
        <label>Select File</label>
        <input type="file" name="file" onChange={(e) => handleFile(e)} />
        <button type="submit">Upload</button>
      </form>

      {backendData && (
        <section>
          {backendData.map((item, id) => {
            return item.map((unit, id) => {
              if (id === 0) {
                return <h1 key={id}>{unit}</h1>;
              }
              return <p key={id}>{unit}</p>;
            });
          })}
        </section>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";
import { Upload } from "./components/Upload";
import { Table } from "./components/Table";

const App = () => {
  const [backendData, setBackendData] = useState([]);
  const [file, setFile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [wagePerHour, setWagePerHour] = useState(0);

  // fetch data from the server if CSV file is already uploaded
  useEffect(() => {
    Axios({
      url: "/data",
      method: "GET",
    }).then((res) => {
      setBackendData(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Výpočet nákladů</h1>
      <Upload
        file={file}
        setFile={setFile}
        backendData={backendData}
        setBackendData={setBackendData}
        setTotalHours={setTotalHours}
        setWagePerHour={setWagePerHour}
      />
      {backendData.length > 0 && (
        <>
          <Table
            backendData={backendData}
            totalHours={totalHours}
            setTotalHours={setTotalHours}
            wagePerHour={wagePerHour}
            setWagePerHour={setWagePerHour}
          />
        </>
      )}
    </div>
  );
};

export default App;

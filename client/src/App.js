import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";

const App = () => {
  const [backendData, setBackendData] = useState([]);
  const [file, setFile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [wagePerHour, setWagePerHour] = useState(0);

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

  const handleCheck = (e, uniqueId) => {
    const lastInput = document.getElementById(`lastInput-${uniqueId}`);
    // deselect last input
    lastInput.type = "hidden";
    lastInput.value = 0;
    if (e.target.id === `lastRadio-${uniqueId}`) {
      // select last input
      lastInput.type = "number";
      document.getElementById(`lastRadio-${uniqueId}`).value = 0;
    }
    // submit form of the current row
    document.getElementById(`${uniqueId}`).requestSubmit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const checkedInputs = Array.from(
      document.querySelectorAll("input[type=radio]:checked")
    );
    const counterArr = checkedInputs.map((input) => Number(input.value));
    let total = 0;
    for (let i = 0; i < counterArr.length; i++) {
      total += counterArr[i];
    }
    setTotalHours(total);
  };

  const download = () => {
    const dataToParse = [];
    const rows = Array.from(document.querySelectorAll("tr"));
    rows.shift(); // we don't need headers row
    rows.forEach((row) => {
      const tds = Array.from(row.childNodes);
      // název
      const nazev = tds[0].innerText;
      // hodiny
      const checkedInput = tds.find((td) => td.children[0].checked === true);
      const hodiny = checkedInput?.children[0].value || "0";
      // push the object to array
      dataToParse.push({
        nazev: nazev,
        hodiny: hodiny,
      });
    });
    const csvData = objectToCsv(dataToParse);
    // download (this can be single func...)
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "náklady.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const objectToCsv = (dataToParse) => {
    const cvsRows = [["název", "hodiny"]];
    for (const row of dataToParse) {
      cvsRows.push([`"${row.nazev}"`, `${row.hodiny}`].join(","));
    }
    cvsRows.push(["celkem hodin", `${totalHours}`]);
    cvsRows.push(["hodinová sazba", `${wagePerHour} Kč`]);
    cvsRows.push(["celková cena", `${totalHours * wagePerHour} Kč`]);
    return cvsRows.join("\n");
  };

  const deleteFile = () => {
    Axios({
      url: "/delete",
      method: "GET",
    }).then((res) => {
      document.querySelector(".chooseFile").value = "";
      setBackendData([]);
      setFile(null);
      alert(res.data);
    });
  };

  return (
    <div>
      <h1>CSV File Upload</h1>
      <form onSubmit={(e) => handleUpload(e)}>
        <p>Nahrání nového souboru způsobí, že se přepíšou data.</p>
        <label>Select File</label>
        <input
          accept=".csv"
          className="chooseFile"
          type="file"
          name="file"
          onChange={(e) => handleFile(e)}
        />
        <button type="submit">Upload</button>
      </form>

      {backendData.length > 0 && (
        <>
          <button type="button" onClick={deleteFile}>
            Delete file
          </button>

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
                            <form id={uniqueId} onSubmit={handleSubmit}>
                              {cell}
                            </form>
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
                        id={`lastRadio-${uniqueId}`}
                        onClick={(e) => handleCheck(e, uniqueId)}
                      />
                      <input
                        type="hidden"
                        min="0"
                        name={uniqueId}
                        id={`lastInput-${uniqueId}`}
                        onChange={(e) => {
                          // change the value of associated input
                          document.getElementById(
                            `lastRadio-${uniqueId}`
                          ).value = e.target.value;
                          document
                            .getElementById(`${uniqueId}`)
                            .requestSubmit();
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <section>
            <p>Celkem hodin: {totalHours}</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="wagePerHour">Hodinová sazba:</label>
              <input
                type="number"
                min="0"
                name="wagePerHour"
                value={wagePerHour}
                onChange={(e) => setWagePerHour(e.target.value)}
              />
            </form>
            <p>Celková cena za projekt: {totalHours * wagePerHour} Kč</p>
          </section>

          <button onClick={download} type="button">
            Export
          </button>
        </>
      )}
    </div>
  );
};

export default App;

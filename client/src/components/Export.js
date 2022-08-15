import React from "react";

export const Export = ({ totalHours, wagePerHour }) => {
  const handleClick = () => {
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
    download(csvData);
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

  const download = (data) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "Náklady.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <button onClick={handleClick} type="button">
      Export
    </button>
  );
};

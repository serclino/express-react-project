import React from "react";
import { Counter } from "./Counter";
import { Export } from "./Export";

export const Table = ({
  backendData,
  totalHours,
  setTotalHours,
  wagePerHour,
  setWagePerHour,
}) => {
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
    // submit form of the current row -> handleSubmit()
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

  return (
    <>
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
                      document.getElementById(`lastRadio-${uniqueId}`).value =
                        e.target.value;
                      document.getElementById(`${uniqueId}`).requestSubmit();
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Counter
        totalHours={totalHours}
        wagePerHour={wagePerHour}
        setWagePerHour={setWagePerHour}
      />
      <Export totalHours={totalHours} wagePerHour={wagePerHour} />
    </>
  );
};

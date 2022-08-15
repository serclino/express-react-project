import React from "react";

export const Counter = ({ totalHours, wagePerHour, setWagePerHour }) => {
  return (
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
  );
};

import { useState } from "react";
import { MeterReading } from "./types";
import "./styles.css";
import { isValidReading } from "./utils/validation";

export default function App() {
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [readingInput, setReadingInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const readingListItems = readings.map((reading, index) => (
    <li key={index}>{reading.value}</li>
  ));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newReadingValue = Number(readingInput);

    if (!isValidReading(newReadingValue, readings)) {
      setErrorMessage(true);
      return;
    }

    const newReading: MeterReading = {
      value: newReadingValue,
      source: "customer",
    };
    setReadings((prevReadings) => [newReading, ...prevReadings]);
    setReadingInput("");
    setErrorMessage(false);
  };

  const calculatePrediction = () => {
    if (readings.length < 4) {
      return "Coming soon";
    } else {
      let totalDistance = 0;
      for (let i = 1; i < 4; i++) {
        const distance = readings[i - 1].value - readings[i].value;
        totalDistance += distance;
      }

      const averageDistance = totalDistance / 3;
      return readings[0].value + averageDistance;
    }
  };

  return (
    <>
      <div className="App">
        <h1>Meter Readings</h1>
        <form onSubmit={handleSubmit}>
          <p>Enter a new meter reading:</p>
          <input
            data-testid="input-field"
            value={readingInput}
            pattern="[0-9]{5}"
            onChange={(e) => setReadingInput(e.target.value)}
          />
          <button type="submit" data-testid="submit">
            Submit
          </button>
        </form>
        {errorMessage && (
          <p className="error" data-testid="error-message">
            Please enter a valid meter reading (between 00000 and 99999).
          </p>
        )}
        <h2>Predicted usage next month</h2>
        <p data-testid="predicted-usage-field">{calculatePrediction()}</p>
        <h2>Previous meter readings</h2>
        <ul>{readingListItems}</ul>
      </div>
    </>
  );
}

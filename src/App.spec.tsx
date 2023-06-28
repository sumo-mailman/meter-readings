import {
  fireEvent,
  getByTestId,
  getByText,
  queryByText,
  screen,
  render,
} from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom/extend-expect";

describe("App", () => {
  test("includes the header", () => {
    const app = render(<App />);
    app.getByText("Meter Readings");
  });

  test("submits customer reading successfully", () => {
    const app = render(<App />);
    const input = getByTestId(app.container, "input-field");
    fireEvent.change(input, { target: { value: "100" } });
    const submit = getByTestId(app.container, "submit");
    fireEvent.click(submit);

    const customerData = getByText(app.container, "100");
    expect(customerData).toBeInTheDocument();
  });

  test("submit three customer readings, with NO predicted usage next month", () => {
    const app = render(<App />);
    const input = getByTestId(app.container, "input-field");
    fireEvent.change(input, { target: { value: "00100" } });
    const submit = getByTestId(app.container, "submit");
    fireEvent.click(submit);

    const predictedUsageField = screen.getByTestId("predicted-usage-field");
    expect(predictedUsageField).toHaveTextContent("Coming soon");

    fireEvent.change(input, { target: { value: "00200" } });
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00300" } });
    fireEvent.click(submit);

    expect(getByText(app.container, "100")).toBeInTheDocument();
    expect(getByText(app.container, "200")).toBeInTheDocument();
    expect(getByText(app.container, "300")).toBeInTheDocument();

    expect(predictedUsageField).toHaveTextContent("Coming soon");
  });
  test("submit five customer readings, with a predicted usage next month", () => {
    const app = render(<App />);
    const input = getByTestId(app.container, "input-field");
    fireEvent.change(input, { target: { value: "00100" } });
    const submit = getByTestId(app.container, "submit");
    fireEvent.click(submit);

    const predictedUsageField = screen.getByTestId("predicted-usage-field");
    expect(predictedUsageField).toHaveTextContent("Coming soon");

    fireEvent.change(input, { target: { value: "00250" } });
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00350" } });
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00400" } });
    fireEvent.click(submit);

    expect(getByText(app.container, "100")).toBeInTheDocument();
    expect(getByText(app.container, "250")).toBeInTheDocument();
    expect(getByText(app.container, "350")).toBeInTheDocument();
    expect(getByText(app.container, "400")).toBeInTheDocument();
    expect(predictedUsageField).toHaveTextContent("500");
  });

  test("error message shows and submission is prevented, if meter reading less than previous readings", () => {
    const app = render(<App />);
    const input = getByTestId(app.container, "input-field");
    fireEvent.change(input, { target: { value: "00100" } });
    const submit = getByTestId(app.container, "submit");
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00250" } });
    fireEvent.click(submit);

    const errorMessageHidden = queryByText(
      app.container,
      "Please enter a valid meter reading (between 00000 and 99999)."
    );
    expect(errorMessageHidden).toBeNull();

    fireEvent.change(input, { target: { value: "00350" } });
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00200" } });
    fireEvent.click(submit);

    const errorMessage = getByText(
      app.container,
      "Please enter a valid meter reading (between 00000 and 99999)."
    );
    expect(errorMessage).toBeInTheDocument();
  });
  test("error message does not show unless there is an error", () => {
    const app = render(<App />);
    const input = getByTestId(app.container, "input-field");
    fireEvent.change(input, { target: { value: "00100" } });
    const submit = getByTestId(app.container, "submit");
    fireEvent.click(submit);
    fireEvent.change(input, { target: { value: "00250" } });
    fireEvent.click(submit);

    const errorMessageHidden = queryByText(
      app.container,
      "Please enter a valid meter reading (between 00000 and 99999)."
    );
    expect(errorMessageHidden).toBeNull();
  });
});

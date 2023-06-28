import { MeterReading } from "../types";

export const isValidReading = (reading: number, readings: MeterReading[]) => {
    if (reading < 0 || reading > 99999) {
      return false;
    }

    const lastCustomerReading = readings.find(
      (reading) => reading.source === "customer"
    );
    if (lastCustomerReading && reading <= lastCustomerReading.value) {
      return false;
    }

    const lastReading = readings[readings.length - 1];
    if (lastReading && reading <= lastReading.value) {
      return false;
    }

    return true;
  };
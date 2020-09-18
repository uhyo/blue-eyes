import { useRef } from "react";
import { useLastValue } from "./useLastValue";

export const useIsChanged = <T>(value: T) => {
  const lastValue = useLastValue(value);
  return lastValue !== value;
};

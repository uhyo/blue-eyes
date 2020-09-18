import { useRef } from "react";

export const useLastValue = <T>(value: T): T | undefined => {
  const lastValueRef = useRef<T | undefined>(undefined);
  const result = lastValueRef.current;
  lastValueRef.current = value;
  return result;
};

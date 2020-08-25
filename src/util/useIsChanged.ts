import { useRef } from "react";

export const useIsChanged = <T>(value: T) => {
  const lastValueRef = useRef<T | undefined>(undefined);
  const result = lastValueRef.current !== value;
  lastValueRef.current = value;
  return result;
};

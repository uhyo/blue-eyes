import { useRef, useEffect } from "react";
import { InputData } from "./moveFrame";

export const useInput = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): InputData => {
  const inputDataRef = useRef<InputData>();
  if (!inputDataRef.current) {
    inputDataRef.current = {
      canvas: {
        x: 0,
        y: 0,
      },
      mouse: {
        x: 0,
        y: 0,
      },
    };
  }
  const data = inputDataRef.current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const box = canvas.getBoundingClientRect();
      data.canvas.x = box.left;
      data.canvas.y = box.top;
    }

    const handler = (e: MouseEvent) => {
      data.mouse.x = e.clientX;
      data.mouse.y = e.clientY;
    };

    document.addEventListener("mousemove", handler, false);
    return () => {
      document.removeEventListener("mousemove", handler, false);
    };
  }, []);

  return data;
};

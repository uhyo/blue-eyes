import React from "react";
import { Monster } from "./data/Monster";
import { DrawMonster } from "./components/DrawMonster";

const defaultMonster: Monster = {
  seed: 12345,
  base: {
    xRadius: 100,
    yRadius: 130,
    rotation: (45 * Math.PI) / 180,
  },
  body: {
    cellNumber: 12,
  },
  position: {
    x: 200,
    y: 200,
  },
  color: {
    body: "#ff0000",
    eye1: "#ffffff",
    eye2: "#0180ff",
  },
};

export const App: React.FC = () => {
  return <DrawMonster monster={defaultMonster} />;
};

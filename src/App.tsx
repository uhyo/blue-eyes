import React, { useState } from "react";
import { Monster } from "./data/Monster";
import { DrawMonster } from "./components/DrawMonster";
import { useMonster } from "./components/useMonster";
import { css } from "linaria";
import { Control } from "./components/Control";

const defaultMonster: Monster = {
  seed: 99999,
  base: {
    xRadius: 100,
    yRadius: 130,
    rotation: (45 * Math.PI) / 180,
  },
  body: {
    cellNumber: 12,
  },
  position: {
    x: 300,
    y: 300,
  },
  color: {
    body: "#ff0000",
    eye1: "#ffffff",
    eye2: "#0180ff",
  },
};

const main = css`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
`;

export const App: React.FC = () => {
  const [monster, setMonster] = useState<Monster>(defaultMonster);
  const generated = useMonster(monster);
  return (
    <div className={main}>
      <h1>Logo Generator</h1>
      <DrawMonster monster={generated} color={monster.color} />
      <Control monster={monster} onUpdate={setMonster} />
      <p>
        <small>
          このサイトは
          <a href="https://www.expo2025.or.jp/" rel="external noopener">
            2025年大阪・関西万博
          </a>
          を応援しています。
        </small>
      </p>
      <p>
        <small>
          Made by{" "}
          <a href="https://twitter.com/_uhyo" rel="external noopener">
            @uhyo_
          </a>{" "}
          /{" "}
          <a href="https://github.com/uhyo/blue-eyes" rel="external noopener">
            GitHub
          </a>
        </small>
      </p>
      <p>
        <small>このサイトはGoogle Analyticsを使用しています。</small>
      </p>
    </div>
  );
};

import React, { useState } from "react";
import { containerCss, inputCss, buttonCss } from "./style";
import { Monster } from "../../data/Monster";
import { clamp } from "../../logic/math/clamp";

type Props = {
  monster: Monster;
  onUpdate: (monster: Monster) => void;
};

export const Control: React.FC<Props> = ({ monster, onUpdate }) => {
  const [seedString, setSeedString] = useState(String(monster.seed));
  const onUpdateSeed = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setSeedString(e.currentTarget.value);
    const num = parseInt(e.currentTarget.value, 10);
    const newSeed = num | 0;
    if (isFinite(num) && newSeed !== monster.seed) {
      onUpdate({
        ...monster,
        seed: newSeed,
      });
    }
  };

  const onReload = () => {
    const nextSeed = (Math.random() * 2 ** 32) >>> 0;
    setSeedString(String(nextSeed));
    onUpdate({
      ...monster,
      seed: nextSeed,
    });
  };

  const onUpdateSize = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onUpdate({
      ...monster,
      body: {
        ...monster.body,
        cellNumber: Number(e.currentTarget.value) || 12,
      },
    });
  };

  const onUpdateRotation = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onUpdate({
      ...monster,
      base: {
        ...monster.base,
        rotation: (Number(e.currentTarget.value) * Math.PI) / 180 || 0,
      },
    });
  };

  const onUpdateWidth = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onUpdate({
      ...monster,
      base: {
        ...monster.base,
        xRadius: Number(e.currentTarget.value) || 10,
      },
    });
  };

  const onUpdateHeight = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onUpdate({
      ...monster,
      base: {
        ...monster.base,
        yRadius: Number(e.currentTarget.value) || 10,
      },
    });
  };

  return (
    <div className={containerCss}>
      <div>
        Number of Cells:{" "}
        <input
          className={inputCss}
          type="range"
          min="6"
          max="40"
          step="2"
          value={String(monster.body.cellNumber)}
          onChange={onUpdateSize}
        />
        {monster.body.cellNumber}
      </div>
      <div>
        Rotation:{" "}
        <input
          className={inputCss}
          type="range"
          min="0"
          max="359"
          step="1"
          value={String(
            clamp(0, Math.ceil((monster.base.rotation * 180) / Math.PI), 359)
          )}
          onChange={onUpdateRotation}
        />
      </div>
      <div>
        Width:{" "}
        <input
          className={inputCss}
          type="range"
          min="10"
          max="600"
          step="10"
          value={String(monster.base.xRadius)}
          onChange={onUpdateWidth}
        />
      </div>
      <div>
        Height:{" "}
        <input
          className={inputCss}
          type="range"
          min="10"
          max="600"
          step="10"
          value={String(monster.base.yRadius)}
          onChange={onUpdateHeight}
        />
      </div>
      <div>
        Seed:{" "}
        <input
          className={inputCss}
          type="text"
          placeholder="12345"
          value={seedString}
          onChange={onUpdateSeed}
        />{" "}
        <button className={buttonCss} onClick={onReload}>
          reload
        </button>
      </div>
    </div>
  );
};

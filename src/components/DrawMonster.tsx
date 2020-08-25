import { css } from "linaria";
import React, { useEffect, useRef, Fragment } from "react";
import { Monster, MonsterColor } from "../data/Monster";
import { decideMonsterBody } from "../logic/body";
import { decideMonseterEyes } from "../logic/eyes";
import { MonsterGenerationResult } from "./useMonster";

type Props = {
  monster: MonsterGenerationResult;
  color: MonsterColor;
};

const hiddenCanvas = css`
  display: none;
`;

/**
 * Draw the monster.
 */
export const DrawMonster: React.FC<Props> = ({ monster, color }) => {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = bgRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    drawBg(ctx, color, monster);
  }, [monster, color]);

  useEffect(() => {
    const bgCanvas = bgRef.current;
    if (!bgCanvas) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    let handle: number;
    const frame = () => {
      drawFrame(ctx, bgCanvas, monster, color);
      handle = requestAnimationFrame(frame);
    };
    handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [monster, color]);

  return (
    <Fragment>
      <canvas className={hiddenCanvas} ref={bgRef} width="400" height="400" />
      <canvas ref={canvasRef} width="400" height="400" />
    </Fragment>
  );
};

function drawBg(
  ctx: CanvasRenderingContext2D,
  color: MonsterColor,
  monster: MonsterGenerationResult
) {
  const { cells, eyes } = monster;
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color.body;
  for (const cell of cells) {
    ctx.beginPath();
    ctx.ellipse(
      cell.x,
      cell.y,
      cell.xRadius,
      cell.yRadius,
      cell.rotation,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  for (const eye of eyes) {
    ctx.fillStyle = color.eye1;
    ctx.beginPath();
    ctx.ellipse(
      eye.x,
      eye.y,
      eye.areaRadius,
      eye.areaRadius,
      0,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  // for (const eye of eyes) {
  //   ctx.fillStyle = color.eye2;
  //   ctx.beginPath();
  //   ctx.ellipse(
  //     eye.x + eye.orbitRadius,
  //     eye.y,
  //     eye.eyeRadius,
  //     eye.eyeRadius,
  //     0,
  //     0,
  //     Math.PI * 2
  //   );
  //   ctx.closePath();
  //   ctx.fill();
  // }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  bgCanvas: HTMLCanvasElement,
  monster: MonsterGenerationResult,
  color: MonsterColor
) {
  const { eyes } = monster;
  ctx.drawImage(bgCanvas, 0, 0);

  for (const eye of eyes) {
    ctx.fillStyle = color.eye2;
    ctx.beginPath();
    ctx.ellipse(
      eye.x + eye.orbitRadius,
      eye.y,
      eye.eyeRadius,
      eye.eyeRadius,
      0,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }
}

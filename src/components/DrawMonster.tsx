import { css } from "linaria";
import React, { useEffect, useRef, Fragment } from "react";
import { Monster, MonsterColor } from "../data/Monster";
import { decideMonsterBody } from "../logic/body";
import { decideMonseterEyes } from "../logic/eyes";
import { MonsterGenerationResult } from "./useMonster";
import { useMove, MoveData } from "./useMove";

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
  const bgDataRef = useRef<ImageData | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const move = useMove(monster);

  useEffect(() => {
    const ctx = bgRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    bgDataRef.current = drawBg(ctx, color, monster);
  }, [monster, color]);

  useEffect(() => {
    const bgData = bgDataRef.current;
    if (!bgData) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    let handle: number;
    const frame = () => {
      drawFrame(ctx, bgData, monster, color, move);
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

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  bgData: ImageData,
  monster: MonsterGenerationResult,
  color: MonsterColor,
  move: MoveData
) {
  const { eyes } = monster;
  ctx.putImageData(bgData, 0, 0);

  for (const [i, eye] of eyes.entries()) {
    const { angle } = move.eyes[i];
    ctx.fillStyle = color.eye2;
    ctx.beginPath();
    ctx.ellipse(
      eye.x + Math.cos(angle) * eye.orbitRadius,
      eye.y + Math.sin(angle) * eye.orbitRadius,
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

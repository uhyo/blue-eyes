import React, { useEffect, useRef } from "react";
import { Monster } from "../data/Monster";
import { decideMonsterBody } from "../logic/body";

type Props = {
  monster: Monster;
};

/**
 * Draw the monster.
 */
export const DrawMonster: React.FC<Props> = ({ monster }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    draw(ctx, monster);
  }, [monster]);

  return <canvas ref={canvasRef} width="400" height="400"></canvas>;
};

function draw(ctx: CanvasRenderingContext2D, monster: Monster) {
  const { color } = monster;
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cells = decideMonsterBody(monster, Math.random);

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
  for (const cell of cells) {
    ctx.fillStyle = color.eye2;
    ctx.beginPath();
    ctx.ellipse(cell.x, cell.y, 5, 5, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

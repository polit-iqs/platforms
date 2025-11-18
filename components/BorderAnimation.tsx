"use client";

import { useEffect, useState } from "react";

interface Sq {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  phase: "in" | "hold" | "out";
  timer: number;
  side: "left" | "right";
}

export default function SideCornerSquares() {
  const [squares, setSquares] = useState<Sq[]>([]);

  const attachPositions = (sq: Sq) => {
    const out: { x: number; y: number }[] = [];
    const sizes = [24, 48];

    for (const newS of sizes) {
      out.push(
        { x: sq.x - newS, y: sq.y - newS },
        { x: sq.x + sq.size, y: sq.y - newS },
        { x: sq.x - newS, y: sq.y + sq.size },
        { x: sq.x + sq.size, y: sq.y + sq.size }
      );
    }
    return out;
  };

  const pickAttach = (existing: Sq[], side: "left" | "right") => {
    const group = existing.filter(s => s.side === side);
    if (group.length === 0) return null;
    const base = group[Math.floor(Math.random() * group.length)];
    const opts = attachPositions(base);
    return opts[Math.floor(Math.random() * opts.length)];
  };

  const initialSpawn = (side: "left" | "right") => {
    const size = 48;
    const y = Math.random() * window.innerHeight * 0.8 + 40;
    const x = side === "left" ? 20 : window.innerWidth - size - 20;

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      opacity: 0,
      phase: "in" as const,
      timer: 0,
      side
    };
  };

  useEffect(() => {
    const spawn = () => {
      setSquares(prev => {
        const cleaned = prev.filter(q => Date.now() - q.id < 6000);

        const side = Math.random() < 0.5 ? "left" : "right";

        if (!cleaned.some(s => s.side === side)) {
          return [...cleaned, initialSpawn(side)];
        }

        const pos = pickAttach(cleaned, side);
        if (!pos) return cleaned;

        const size = Math.random() < 0.5 ? 24 : 48;

        return [
          ...cleaned,
          {
            id: Date.now() + Math.random(),
            x: pos.x,
            y: pos.y,
            size,
            opacity: 0,
            phase: "in",
            timer: 0,
            side
          }
        ];
      });
    };

    const h = setInterval(spawn, 500);
    return () => clearInterval(h);
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      setSquares(prev =>
        prev
          .map((sq): Sq => {
            if (sq.phase === "in") {
              const next = sq.opacity + 0.02;
              if (next >= 1) return { ...sq, opacity: 1, phase: "hold", timer: 0 };
              return { ...sq, opacity: next };
            }

            if (sq.phase === "hold") {
              if (sq.timer > 80) return { ...sq, phase: "out" };
              return { ...sq, timer: sq.timer + 1 };
            }

            if (sq.phase === "out") {
              const next = sq.opacity - 0.04;
              return { ...sq, opacity: Math.max(0, next) };
            }

            return sq;
          })
          .filter(s => s.opacity > 0) as Sq[]
      );
    }, 40);

    return () => clearInterval(loop);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {squares.map(sq => (
        <div
          key={sq.id}
          className="absolute bg-black"
          style={{
            left: sq.x,
            top: sq.y,
            width: sq.size,
            height: sq.size,
            opacity: sq.opacity,
            transition: "opacity 0.25s linear"
          }}
        />
      ))}
    </div>
  );
}

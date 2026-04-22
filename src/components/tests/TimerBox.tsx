//уроки 29, 30, 36, 38
/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";

type TimerBoxProps = {
  durationSec: number;
  finished?: boolean;
  spentSec?: number;
  onFinish?: () => void;
  onTick?: (timeLeft: number) => void;
};

const Box = styled.aside<{ danger: boolean; finished: boolean }>`
  height: 120px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: #fff;
  border: 2px solid
    ${({ finished, danger }) => (finished ? "#e5e7eb" : danger ? "#ffb3b3" : "#cfe0ff")};
  color: ${({ finished, danger }) => (finished ? "#475569" : danger ? "#e00000" : "#1b5de0")};
  .label {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.8;
  }
  .time {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
  }
`;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TimerBox({ durationSec, finished = false, spentSec, onFinish, onTick }: TimerBoxProps) {
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [timeIsOver, setTimeIsOver] = useState(false);

  useEffect(() => {
    if (finished || timeIsOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeIsOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished, timeIsOver]);

  useEffect(() => {
    if (!timeIsOver) return;
    onFinish?.();
  }, [timeIsOver, onFinish]);

  useEffect(() => {
    if (finished) return;
    onTick?.(timeLeft);
  }, [timeLeft, finished, onTick]);

  const danger = timeLeft <= durationSec / 4;
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);
  const displaySpentSec = spentSec ?? durationSec - timeLeft;

  return (
    <Box danger={danger} finished={finished}>
      <div className="label">{finished ? "Время выполнения:" : "Осталось времени:"}</div>
      <div className="time">{finished ? formatTime(displaySpentSec) : formattedTime}</div>
    </Box>
  );
}

// уроки 23-26
/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { CalendarIcon, TimeIcon, AgainIcon } from "../../icons/icons";
import type { Attempt, TestItem } from "../../store/types";

type Props = {
  test: TestItem;
  lastAttempt?: Attempt | null;
  attemptsLeft?: number | null;
  hasActiveAttempt?: boolean;
  activeAttemptId?: number | null;
  hasGradedAttempt?: boolean;
  bestScore?: number | null;
};

const Card = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e9edf5;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.02);
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
`;

const Desc = styled.p`
  margin: 0 0 12px;
  color: #475569;
  line-height: 1.5;
  max-width: 70ch;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  font-size: 12px;
  color: #0e73f6;
  padding: 6px 10px;
  border-radius: 50px;
  border: 1px solid rgba(14, 115, 246, 0.3);
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 50px;
  color: #0e73f6;
  background: #f4f9ff;
`;

const Retry = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #0e73f6;
  padding: 6px 10px;
  border-radius: 50px;
  border: 1px solid rgba(14, 115, 246, 0.3);
`;

const Actions = styled.div`
  display: grid;
  align-content: end;
`;

const PrimaryBtn = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(180deg, #4f8cff, #0e73f6);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s;
  &:hover {
    filter: brightness(1.03);
  }
`;

const DoneBtn = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #d6f2df;
  background: #eafbf0;
  color: #12914f;
  font-weight: 600;
  cursor: not-allowed;
`;

const Ribbon = styled.div`
  position: absolute;
  right: 16px;
  top: -4px;
  color: #1b5de0;
  font-weight: 700;
  font-size: 18px;
  padding: 20px 10px 0;
  width: 64px;
  height: 84px;
  text-align: center;
  background: #e8f5ff;
  border: 1px solid #dbe9ff;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
`;

function formatDateISO(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU");
}

function formatMinutesFromSec(sec?: number | null): string | null {
  if (!sec && sec !== 0) return null;
  const m = Math.round(sec / 60);
  return `${m} минут`;
}

export default function TestCard({ test, lastAttempt, attemptsLeft, hasActiveAttempt, hasGradedAttempt, bestScore }: Props) {
  const navigate = useNavigate();

  const isGraded = lastAttempt?.status === "graded" || hasGradedAttempt;
  const scoreText = typeof bestScore === "number" ? `${bestScore}/10` : null;
  const deadline = formatDateISO(test.deadlineISO || null);
  const duration = formatMinutesFromSec(test.durationSec ?? null);
  const noAttemptsLeft = attemptsLeft !== null && attemptsLeft !== undefined && attemptsLeft <= 0;
  const hasActive = hasActiveAttempt === true;

  const action = useMemo(() => {
    if (hasActive) return { kind: "resume" as const, label: "Продолжить" };
    if (noAttemptsLeft) return { kind: "locked" as const, label: "" };
    if (isGraded && !test.allowRetry) return { kind: "done" as const, label: "Выполнено" };
    if (isGraded && test.allowRetry) return { kind: "retry" as const, label: "Пройти заново" };
    return { kind: "start" as const, label: "Пройти" };
  }, [hasActive, noAttemptsLeft, isGraded, test.allowRetry]);

  const hasTimeLimit = !!test.durationSec && test.durationSec > 0;
  const oneAttemptOnly = test.attemptsAllowed === 1;
  const hasBoth = hasTimeLimit && oneAttemptOnly;

  function startTest() {
    navigate(`/student/test/${test.id}`, {
      state: { durationSec: test.durationSec },
    });
  }

  function resumeTest() {
    navigate(`/student/test/${test.id}`);
  }

  function handleClick() {
    if (action.kind === "done" || action.kind === "locked") return;
    if (action.kind === "resume") {
      resumeTest();
      return;
    }
    if (!hasTimeLimit && !oneAttemptOnly) {
      startTest();
      return;
    }
    // Здесь будет confirm модалка (вынесена в родителя для централизации)
    startTest();
  }

  return (
    <Card>
      <div>
        <Title>{test.title}</Title>
        <Desc>{test.shortDescription}</Desc>
        <Tags>
          {test.tags.map((t, i) => (
            <Tag key={i}>{t}</Tag>
          ))}
        </Tags>
        <MetaRow>
          {!!deadline && (
            <Chip>
              <CalendarIcon /> {deadline}
            </Chip>
          )}
          {!!duration && (
            <Chip>
              <TimeIcon /> {duration}
            </Chip>
          )}
        </MetaRow>
        {test.allowRetry && (
          <Retry>
            <AgainIcon /> Можно пройти заново
          </Retry>
        )}
      </div>
      <Actions>
        {action.kind === "done" ? (
          <DoneBtn disabled>Выполнено</DoneBtn>
        ) : action.kind === "locked" ? null : (
          <PrimaryBtn onClick={handleClick}>{action.label}</PrimaryBtn>
        )}
      </Actions>
      {scoreText && <Ribbon>{scoreText}</Ribbon>}
    </Card>
  );
}

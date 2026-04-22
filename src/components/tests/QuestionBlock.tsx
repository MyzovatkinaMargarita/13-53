// уроки 27, 28, 30, 34
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import type { AttemptReviewItemDto } from "../../api/data-contracts";

export type QuestionType = "single" | "multiple" | "text";

export type Question = {
  id: number;
  testId: number;
  type: QuestionType;
  text: string;
  options?: string[];
  score: number;
  shuffle?: boolean;
};

export type CheckResult = {
  earned: number;
  max: number;
  status?: "correct" | "wrong" | "partial";
};

type Props = {
  index: number;
  question: Question;
  value: string | string[] | number | null;
  result?: CheckResult;
  showResult?: boolean;
  reviewItem?: AttemptReviewItemDto;
  onChange: (questionId: number, value: string | string[] | number) => void;
};

const Box = styled.article`
  border: 1px solid #e9edf5;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
`;

const Score = styled.div`
  font-size: 12px;
  color: #667085;
  margin-top: 8px;
  text-align: right;
`;

const Options = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
`;

const OptionLabel = styled.label<{ state?: "ok" | "wrong" | "miss" }>`
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #eef1f6;
  border-radius: 8px;
  transition: all 0.2s;

  ${({ state }) =>
    state === "ok" &&
    `
    border-color: #22c55e;
    background: #ecfdf5;
  `}
  ${({ state }) =>
    state === "wrong" &&
    `
    border-color: #ef4444;
    background: #fef2f2;
  `}
  ${({ state }) =>
    state === "miss" &&
    `
    border-color: #22c55e;
    border-style: dashed;
  `}

  input {
    cursor: pointer;
  }
`;

const TextAnswer = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  margin-top: 12px;
  &:focus {
    border-color: #0e8e86;
    box-shadow: 0 0 0 3px rgba(14, 142, 134, 0.12);
  }
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

function getOptionState(
  opt: string,
  type: QuestionType,
  value: string | string[] | number | null,
  correct?: string | string[],
  showResult?: boolean
): "ok" | "wrong" | "miss" | undefined {
  if (!showResult || !correct) return undefined;

  if (type === "single") {
    if (value === opt && opt === correct) return "ok";
    if (value === opt && opt !== correct) return "wrong";
    if (value !== opt && opt === correct) return "miss";
  }

  if (type === "multiple") {
    const user = Array.isArray(value) ? value : [];
    const right = Array.isArray(correct) ? correct : [];
    if (user.includes(opt) && right.includes(opt)) return "ok";
    if (user.includes(opt) && !right.includes(opt)) return "wrong";
    if (!user.includes(opt) && right.includes(opt)) return "miss";
  }

  return undefined;
}

export default function QuestionBlock({ index, question, value, result, showResult = false, reviewItem, onChange }: Props) {
  const { id, type, text, options = [], score } = question;
  const visibleOptions = options; // здесь можно добавить shuffle позже

  return (
    <Box>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Вопрос {index + 1}</div>
      <div style={{ marginBottom: 6 }}>{text}</div>

      {type === "text" && (
        <TextAnswer
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder="Ваш ответ"
          disabled={showResult}
          aria-label={`Ответ на вопрос №${index + 1}`}
        />
      )}

      {type === "single" && (
        <Options>
          {visibleOptions.map((opt, i) => {
            const state = getOptionState(opt, type, value, (question as any).correct, showResult);
            return (
              <li key={i}>
                <OptionLabel state={state}>
                  <input
                    type="radio"
                    name={`q-${id}`}
                    checked={value === opt}
                    onChange={() => onChange(id, opt)}
                    disabled={showResult}
                    aria-label={`Вопрос ${id}: вариант ${i + 1}`}
                  />
                  <span>{opt}</span>
                </OptionLabel>
              </li>
            );
          })}
        </Options>
      )}

      {type === "multiple" && (
        <Options>
          {visibleOptions.map((opt) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(opt);
            const state = getOptionState(opt, type, value, (question as any).correct, showResult);
            return (
              <li key={opt}>
                <OptionLabel state={state}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? arr.filter((v) => v !== opt) : [...arr, opt];
                      onChange(id, next);
                    }}
                    disabled={showResult}
                  />
                  <span>{opt}</span>
                </OptionLabel>
              </li>
            );
          })}
        </Options>
      )}

      <Score>
        {result ? `${result.earned} / ${score}` : score} балл
        {reviewItem && reviewItem.earned !== undefined && ` (сервер: ${reviewItem.earned})`}
      </Score>
    </Box>
  );
}

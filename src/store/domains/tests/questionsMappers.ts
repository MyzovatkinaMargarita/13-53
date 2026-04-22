//урок 50, урок 51
import type { QuestionDto } from "../../../api/data-contracts";
import type { Question } from "../../../components/tests/QuestionBlock";

export function mapQuestionDto(dto: QuestionDto, testId: number): Question {
  return {
    id: dto.id ?? 0,
    testId: testId,
    type: mapQuestionType(dto.type),
    text: dto.text ?? "",
    options: dto.options ?? [],
    score: dto.score ?? 1,
    shuffle: dto.shuffle ?? false,
  };
}

function mapQuestionType(type?: number): "single" | "multiple" | "text" {
  if (type === 2) return "multiple";
  if (type === 3) return "text";
  return "single";
}

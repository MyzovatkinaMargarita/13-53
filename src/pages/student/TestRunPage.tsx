// урок 52
/** @jsxImportSource @emotion/react */
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "@emotion/styled";
import { useStores } from "../../store/useStores";
import { TestRunPageVM } from "../../view-models/student/TestRunPageVM";
import StudentHeader from "../../components/student/StudentHeader";
import QuestionBlock from "../../components/tests/QuestionBlock";
import TimerBox from "../../components/tests/TimerBox";
import ResultScore from "../../components/tests/ResultScore";
import ConfirmModal from "../../components/ui/ConfirmModal";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 20px;
  margin: 24px 0;
`;

const Stack = styled.div`
  display: grid;
  gap: 14px;
`;

const Actions = styled.div`
  margin-top: 8px;
`;

const SubmitBtn = styled.button`
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(180deg, #4f8cff, #3675f4);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const TestRunPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const root = useStores();
  const vm = useMemo(() => new TestRunPageVM(root), [root]);
  const testId = Number(id);

  useEffect(() => {
    if (!isNaN(testId) && testId > 0) {
      vm.init(testId);
    }
  }, [testId, vm]);

  if (isNaN(testId)) {
    return (
      <>
        <StudentHeader title="Тестирование" backTo="/student/tests" />
        <p>Неверный идентификатор теста.</p>
      </>
    );
  }

  if (vm.store.loadState === "loading") {
    return (
      <>
        <StudentHeader title={`Тестирование №${testId}`} backTo="/student/tests" />
        <p>Загрузка вопросов...</p>
      </>
    );
  }

  if (vm.store.loadState === "error") {
    return (
      <>
        <StudentHeader title={`Тестирование №${testId}`} backTo="/student/tests" />
        <p style={{ color: "crimson" }}>{vm.store.loadError}</p>
      </>
    );
  }

  const reviewMap = vm.store.reviewByQuestionId;

  return (
    <>
      <StudentHeader title={`Тестирование №${testId}`} backTo="/student/tests" />
      <Layout>
        <Stack>
          {vm.store.questions.map((q, i) => (
            <QuestionBlock
              key={q.id}
              index={i}
              question={q}
              value={
                vm.store.answers[q.id]?.value ??
                (q.type === "multiple" ? [] : q.type === "text" ? "" : null)
              }
              result={vm.store.results[i]}
              showResult={vm.store.showResult}
              reviewItem={reviewMap.get(q.id)}
              onChange={vm.store.setAnswer}
            />
          ))}
          <Actions>
            <SubmitBtn onClick={() => vm.requestFinish(navigate)} disabled={vm.store.showResult}>
              Отправить
            </SubmitBtn>
          </Actions>
        </Stack>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {vm.store.showResult && <ResultScore earned={vm.store.totalScore} max={vm.store.maxScore} />}
          <TimerBox
            key={`${testId}-${vm.store.durationSec}`}
            durationSec={vm.store.durationSec}
            finished={vm.store.showResult}
            spentSec={vm.store.spentSec}
            onTick={vm.store.setTimeLeftSec}
            onFinish={() => vm.onTimerFinish(navigate)}
          />
        </div>
      </Layout>
      <ConfirmModal
        open={vm.finishModalOpen}
        text={vm.finishText}
        confirmLabel="Завершить"
        cancelLabel="Отмена"
        onConfirm={() => vm.requestFinish(navigate)}
        onClose={vm.closeFinishModal}
      />
    </>
  );
});

export default TestRunPage;

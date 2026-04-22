//уроки 37-38
/** @jsxImportSource @emotion/react */
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import StudentHeader from "../../components/student/StudentHeader";
import TimerBox from "../../components/tests/TimerBox";
import ResultScore from "../../components/tests/ResultScore";

type StudentTestResultState =
  | {
      earned: number;
      max: number;
      timeSec: number;
      attemptsLeft?: number;
    }
  | undefined;

const Layout = styled.section`
  margin: 24px 0;
  display: grid;
  gap: 24px;
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  max-width: 760px;
`;

const AttemptsBox = styled.div`
  background: #ffffff;
  border: 1px solid #e9edf5;
  border-radius: 14px;
  padding: 18px 16px;
  text-align: center;
`;

const AttemptsLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
`;

const AttemptsValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  color: #475569;
`;

const Actions = styled.div`
  margin-top: 8px;
`;

const RetryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

export default function StudentTestResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StudentTestResultState;

  if (!state) {
    navigate("/student/tests", { replace: true });
    return null;
  }

  const { earned, max, timeSec, attemptsLeft } = state;

  return (
    <>
      <StudentHeader title={`Результат теста №${id}`} backTo="/student/tests" />
      <Layout>
        <CardsRow>
          <ResultScore earned={earned} max={max} />
          <TimerBox durationSec={timeSec} spentSec={timeSec} finished />
          {typeof attemptsLeft === "number" && (
            <AttemptsBox>
              <AttemptsLabel>Осталось попыток</AttemptsLabel>
              <AttemptsValue>{attemptsLeft}</AttemptsValue>
            </AttemptsBox>
          )}
        </CardsRow>
        {attemptsLeft !== 0 && (
          <Actions>
            <RetryButton onClick={() => navigate(`/student/test/${id}`, { replace: true })}>
              Пройти заново
            </RetryButton>
          </Actions>
        )}
      </Layout>
    </>
  );
}

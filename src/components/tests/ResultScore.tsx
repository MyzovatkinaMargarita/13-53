//урок 37
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

type ResultScoreProps = {
  earned: number;
  max: number;
};

const Box = styled.div`
  background: #ecfdf3;
  border-radius: 14px;
  padding: 25px 16px;
  text-align: center;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #16a34a;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: #16a34a;
`;

export default function ResultScore({ earned, max }: ResultScoreProps) {
  return (
    <Box>
      <Label>Баллы</Label>
      <Value>
        {earned}/{max}
      </Value>
    </Box>
  );
}

//урок 14
/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
`;

const Header = styled.header`
  background: #0e8e86;
  color: #fff;
  padding: 16px;
  font-size: 20px;
  font-weight: 500;
`;

const Content = styled.main`
  padding: 24px;
`;

export default function StudentLayout() {
  return (
    <Container>
      <Header>Зона студента</Header>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

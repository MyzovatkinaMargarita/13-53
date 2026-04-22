//  урок 14
/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  border-right: 1px solid #eee;
  padding: 16px;
  background: #fafafa;
`;

const Content = styled.main`
  padding: 24px;
`;

export default function AdminLayout() {
  return (
    <Container>
      <Sidebar>Сайдбар администратора</Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

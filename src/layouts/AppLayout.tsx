// урок 14, урок 15
/** @jsxImportSource @emotion/react */
import { Outlet, NavLink } from "react-router-dom";
import styled from "@emotion/styled";

const Header = styled.header`
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #222;
  padding: 4px 0;
  font-weight: 500;

  &.active {
    color: #0e8e86;
    font-weight: 600;
    border-bottom: 2px solid #0e8e86;
  }

  &:hover {
    color: #0e8e86;
  }
`;

const Main = styled.main`
  padding: 24px;
  min-height: calc(100vh - 64px);
`;

export default function AppLayout() {
  return (
    <>
      <Header>
        <Nav>
          <StyledNavLink to="/login" end>
            Login
          </StyledNavLink>
          <StyledNavLink to="/student">Student</StyledNavLink>
          <StyledNavLink to="/admin">Admin</StyledNavLink>
        </Nav>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <footer style={{ textAlign: "center", padding: 16, borderTop: "1px solid #eee" }}>
        © 2025 Платформа тестирования
      </footer>
    </>
  );
}

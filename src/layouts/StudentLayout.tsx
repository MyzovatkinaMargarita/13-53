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

// урок 18
/** @jsxImportSource @emotion/react */
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { TestsIcon, ProfileIcon, StatsIcon } from "../icons/icons";
import Logo from "../assets/Vector.svg";
import { useStores } from "../store/useStores";

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #fff;
`;

const Aside = styled.aside`
  border-right: 1px solid #eef1f6;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;
`;

const Brand = styled.div`
  margin-bottom: 25px;
`;

const Nav = styled.nav`
  display: grid;
  gap: 6px;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #09090b;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f6f8fb;
  }
  &:focus-visible {
    outline: 2px solid #0e73f6;
    outline-offset: 2px;
  }
  &.active {
    background: #e8f5ff;
    color: #0e73f6;
  }
`;

const IconBox = styled.span`
  display: inline-grid;
  place-items: center;
`;

const Main = styled.main`
  padding: 25px 30px;
  background-color: #fbfbfb;
`;

const Spacer = styled.div`
  flex: 1;
`;

const LogoutBtn = styled.button`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 0;
  background: transparent;
  color: #09090b;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const StudentLayout = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStores();

  const onLogout = async () => {
    await authStore.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Shell>
      <Aside>
        <Brand>
          <img src={Logo} alt="ПАЗЛ & КОД" />
        </Brand>
        <Nav>
          <Item to="/student/tests" end aria-label="Перейти к списку тестов">
            <IconBox>
              <TestsIcon />
            </IconBox>
            Тестирования
          </Item>
          <Item to="/student/statistics" aria-label="Перейти к статистике">
            <IconBox>
              <StatsIcon />
            </IconBox>
            Статистика
          </Item>
          <Item to="/student/profile" aria-label="Перейти к профилю">
            <IconBox>
              <ProfileIcon />
            </IconBox>
            Профиль
          </Item>
        </Nav>
        <Spacer />
        <LogoutBtn type="button" onClick={onLogout}>
          <IconBox aria-hidden>⎋</IconBox>
          Выйти
        </LogoutBtn>
      </Aside>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
});

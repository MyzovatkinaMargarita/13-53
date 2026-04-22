// урок 14, урок 15
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/login/LoginPage";
import StudentPage from "../pages/student/StudentPage";
import AdminPage from "../pages/admin/AdminPage";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentTests from "../pages/student/StudentTests"; // создадим чуть позже
import StudentTestPage from "../pages/student/StudentTestPage"; // создадим позже

// Временные заглушки для страниц, которые будут созданы позже
const StudentTestsPlaceholder = () => <h2>Список тестов (скоро)</h2>;
const StudentStatsPlaceholder = () => <h2>Статистика</h2>;
const StudentProfilePlaceholder = () => <h2>Профиль</h2>;
const StudentTestPagePlaceholder = () => <h2>Страница теста</h2>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LoginPage /> }, // редирект позже
      { path: "login", element: <LoginPage /> },
      {
        path: "student",
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentPage /> },
          { path: "tests", element: <StudentTestsPlaceholder /> },
          { path: "statistics", element: <StudentStatsPlaceholder /> },
          { path: "profile", element: <StudentProfilePlaceholder /> },
          { path: "test/:id", element: <StudentTestPagePlaceholder /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminPage /> },
          { path: "settings", element: <h2>Admin Settings</h2> },
        ],
      },
    ],
  },
]);

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



// src/app/router.tsx
// Финальная версия с защищёнными маршрутами
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/login/LoginPage";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import StudentTestsPage from "../pages/student/StudentTestsPage";
import StudentStatsPage from "../pages/student/StudentStatsPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import TestRunPage from "../pages/student/TestRunPage";
import StudentTestResultPage from "../pages/student/StudentTestResultPage";
import AdminPage from "../pages/admin/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "student",
        element: <ProtectedRoute />,
        children: [
          {
            element: <StudentLayout />,
            children: [
              { index: true, element: <Navigate to="tests" replace /> },
              { path: "tests", element: <StudentTestsPage /> },
              { path: "statistics", element: <StudentStatsPage /> },
              { path: "profile", element: <StudentProfilePage /> },
              { path: "test/:id", element: <TestRunPage /> },
              { path: "test/:id/result", element: <StudentTestResultPage /> },
            ],
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminPage /> },
              { path: "settings", element: <h2>Admin Settings</h2> },
            ],
          },
        ],
      },
    ],
  },
]);

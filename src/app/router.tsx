//уроки 14, 15, 48
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

// урок 14, урок 15
import { useNavigate } from "react-router-dom";

export default function StudentPage() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: 24 }}>
      <h1>Student Dashboard</h1>
      <p>Добро пожаловать в личный кабинет студента.</p>
      <button
        onClick={() => navigate("/student/tests")}
        style={{
          marginTop: 16,
          padding: "8px 16px",
          backgroundColor: "#0E8E86",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Список тестов
      </button>
    </section>
  );
}

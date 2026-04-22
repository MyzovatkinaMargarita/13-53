//урок 14, урок 15
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Здесь будет реальная авторизация позже (Урок 48)
    console.log("Login:", { email, password });
    navigate("/student", { replace: true });
  }

  return (
    <div style={{ maxWidth: 320, margin: "0 auto", paddingTop: 48 }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: 8, background: "#0e8e86", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Войти
        </button>
      </form>
    </div>
  );
}

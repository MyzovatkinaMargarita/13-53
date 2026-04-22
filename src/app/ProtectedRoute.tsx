// урок 48
import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../store/useStores";

export const ProtectedRoute = observer(() => {
  const { authStore } = useStores();

  if (!authStore.isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
});

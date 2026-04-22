//урок 13, урок 14
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/theme";
import "./styles/globals.css";
import { router } from "./app/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/theme";
import "./styles/globals.css";
import { router } from "./app/router";
import { StoreProvider } from "./store/StoreProvider";
import ModalHost from "./components/ui/ModalHost";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <StoreProvider>
      <RouterProvider router={router} />
      <ModalHost />
    </StoreProvider>
  </ThemeProvider>
);

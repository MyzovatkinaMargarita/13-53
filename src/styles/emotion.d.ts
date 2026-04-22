// урок 13, шаг 6
import "@emotion/react";
import type { AppTheme } from "./theme";

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}

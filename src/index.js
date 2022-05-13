import React from "react";
import ReactDOM from "react-dom";
import { HabitProvider } from "./Context/habit-context";
import { PomodoroProvider } from "./Context/pomodoro-context";
import { TokenProvider } from "./Context/token-context";
import { ToastProvider } from "./Context/toast-context";
import { makeServer } from "./server";
import App from "./App";

makeServer();

ReactDOM.render(
  <React.StrictMode>
    <HabitProvider>
      <PomodoroProvider>
        <TokenProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TokenProvider>
      </PomodoroProvider>
    </HabitProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

import { createContext, useContext, useReducer } from "react";

const PomodoroContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SECONDS":
      return {
        ...state,
        seconds: action.payload,
      };
    case "SET_MINUTES":
      return {
        ...state,
        minutes: action.payload,
      };
    case "SET_POMODORO_COUNT":
      return {
        ...state,
        pomodoroCount: action.payload,
      };
    case "SET_POMODORO_RUNNING":
      return {
        ...state,
        pomodoroRunning: action.payload,
      };
    case "SET_DISPLAY_MESSAGE":
      return {
        ...state,
        displayBreakMessage: action.payload,
      };
    case "SET_RESET_FLAG":
      return {
        ...state,
        resetFlag: action.payload,
      };
    default:
      return state;
  }
};

const PomodoroProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    minutes: 25,
    seconds: 0,
    displayBreakMessage: false,
    pomodoroRunning: false,
    pomodoroCount: 0,
    resetFlag: false,
  });

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
      {children}
    </PomodoroContext.Provider>
  );
};

const usePomodoro = () => useContext(PomodoroContext);

export { usePomodoro, PomodoroProvider };

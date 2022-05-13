import "./pomodoro.css";
import { usePomodoro } from "../../Context/pomodoro-context";
import { useEffect } from "react";

const Pomodoro = () => {
  const { state, dispatch } = usePomodoro();
  const timerMinutes = state.minutes < 10 ? `0${state.minutes}` : state.minutes;
  const timerSeconds = state.seconds < 10 ? `0${state.seconds}` : state.seconds;

  useEffect(
    state.pomodoroRunning
      ? () => {
          let interval = setInterval(() => {
            clearInterval(interval);
            if (state.seconds === 0) {
              if (state.minutes === 0) {
                if (state.displayBreakMessage === true) {
                  dispatch({ type: "SET_SECONDS", payload: 0 });
                  dispatch({ type: "SET_MINUTES", payload: 25 });
                } else {
                  if (state.pomodoroCount === 3) {
                    dispatch({ type: "SET_SECONDS", payload: 0 });
                    dispatch({ type: "SET_MINUTES", payload: 15 });
                    dispatch({ type: "SET_POMODORO_COUNT", payload: 0 });
                  } else {
                    dispatch({ type: "SET_SECONDS", payload: 0 });
                    dispatch({ type: "SET_MINUTES", payload: 5 });
                    dispatch({
                      type: "SET_POMODORO_COUNT",
                      payload: state.pomodoroCount + 1,
                    });
                  }
                }
                dispatch({
                  type: "SET_DISPLAY_MESSAGE",
                  payload: !state.displayBreakMessage,
                });
              } else {
                dispatch({ type: "SET_SECONDS", payload: 59 });
                dispatch({ type: "SET_MINUTES", payload: state.minutes - 1 });
              }
            } else {
              dispatch({ type: "SET_SECONDS", payload: state.seconds - 1 });
            }
          }, 1000);
        }
      : state.resetFlag
      ? () => {
          dispatch({ type: "SET_SECONDS", payload: 0 });
          dispatch({ type: "SET_MINUTES", payload: 25 });
          dispatch({
            type: "SET_DISPLAY_MESSAGE",
            payload: false,
          });
        }
      : () => {},
    [state]
  );

  return (
    <div className="Pomodoro">
      <h3 className="pomodoro-title">Pomodoro</h3>
      <div className="pomodoro-button-group">
        <button
          onClick={() => {
            dispatch({
              type: "SET_POMODORO_RUNNING",
              payload: !state.pomodoroRunning,
            });
            state.resetFlag &&
              dispatch({ type: "SET_RESET_FLAG", payload: false });
          }}
        >
          {state.pomodoroRunning ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            dispatch({ type: "SET_POMODORO_RUNNING", payload: false });
            dispatch({ type: "SET_RESET_FLAG", payload: true });
          }}
        >
          Reset
        </button>
      </div>
      <div className="timer">
        {state.displayBreakMessage && (
          <div>
            <h3>Break time! Next session starts in: </h3>
          </div>
        )}
        <span>
          {timerMinutes}:{timerSeconds}
        </span>
      </div>
    </div>
  );
};

export default Pomodoro;

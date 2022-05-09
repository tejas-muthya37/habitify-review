import "./habit.css";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UndoIcon from "@mui/icons-material/Undo";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { useHabit } from "./../../Context/habit-context.js";
import { useToken } from "../../Context/token-context";
import { Box } from "@mui/system";
import { Modal } from "@mui/material";
import { useState, useEffect } from "react";

const Habit = ({ name, status, id, archivedPage }) => {
  const { encodedToken } = useToken();
  const {
    habitsArray,
    habitDetails,
    setHabitDetails,
    archiveHabit,
    unarchiveHabit,
    markHabitComplete,
    incrementCompleteCount,
    markHabitFail,
    undoAction,
    editHabit,
    deleteHabit,
    saveEditedHabit,
  } = useHabit();

  useEffect(() => {
    localStorage.setItem("HABITS_ARRAY", JSON.stringify(habitsArray));
  }, [habitsArray]);

  if (window.innerWidth > 600) var modalWidth = 500;
  else modalWidth = "90%";

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: modalWidth,
    bgcolor: "var(--primary-bg)",
    border: "none",
    outline: "none",
    color: "var(--primary-color)",
    boxShadow: 24,
    p: 3,
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.3rem",
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const habitFound = habitsArray.find((element) => element._id === id);

  return (
    <div className="Habit">
      <div className="habit-section">
        <div className="habit-section-left">
          <h3>{name}</h3>
          <span>
            {status}{" "}
            {habitFound.timesOrMins === "Times" &&
              habitFound.frequency > 1 &&
              `${habitFound.completedTimes}/${habitFound.frequency}`}
          </span>
        </div>
        <div className="habit-icons-group">
          {archivedPage === false && (
            <ArchiveIcon
              onClick={() => archiveHabit(habitFound, encodedToken)}
            />
          )}
          {archivedPage === true && (
            <UnarchiveIcon
              onClick={() => unarchiveHabit(habitFound, encodedToken)}
            />
          )}
          {archivedPage === false &&
            status !== "Failed" &&
            status !== "Completed" &&
            habitFound.frequency < 2 && (
              <DoneIcon onClick={() => markHabitComplete(id)} />
            )}
          {archivedPage === false &&
            status !== "Failed" &&
            status !== "Completed" &&
            habitFound.timesOrMins === "Times" &&
            habitFound.frequency > 1 &&
            habitFound.completedTimes < habitFound.frequency && (
              <span
                className="plus-one-icon"
                onClick={() => incrementCompleteCount(id)}
              >
                +1
              </span>
            )}
          {archivedPage === false &&
            status !== "Failed" &&
            status !== "Completed" && (
              <CloseIcon onClick={() => markHabitFail(id)} />
            )}
          {archivedPage === false &&
            (status === "Completed" || status === "Failed") && (
              <UndoIcon onClick={() => undoAction(id)} />
            )}
          <ModeEditIcon
            onClick={() => {
              editHabit(id);
              handleOpen();
            }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <form className="navbar-modal">
                <div className="input-groups">
                  <span>Name</span>
                  <div>
                    <input
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          name: event.target.value,
                        })
                      }
                      type="text"
                      value={habitDetails.name}
                    />
                  </div>
                </div>
                <div className="input-groups">
                  <span>Goal</span>
                  <div className="goal-details">
                    <input
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          frequency: parseInt(event.target.value),
                        })
                      }
                      value={habitDetails.frequency}
                      type="number"
                      min="1"
                    />
                    <select
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          timesOrMins: event.target.value,
                        })
                      }
                    >
                      <option>Times</option>
                      <option>Mins</option>
                    </select>
                    <select
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          repeatCriteria: event.target.value,
                        })
                      }
                    >
                      <option>Per Day</option>
                      <option>Per Week</option>
                      <option>Per Month</option>
                    </select>
                    <select
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          timeOfDay: event.target.value,
                        })
                      }
                    >
                      <option>Any Time</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </div>
                </div>
                <div className="input-groups-parent">
                  <div className="input-groups">
                    <span>Start Date</span>
                    <input
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          startDate: event.target.value,
                        })
                      }
                      type="date"
                      value={habitDetails.startDate}
                    />
                  </div>
                  <div className="input-groups">
                    <span>End Date</span>
                    <input
                      onChange={(event) =>
                        setHabitDetails({
                          ...habitDetails,
                          endDate: event.target.value,
                        })
                      }
                      type="date"
                      value={habitDetails.endDate}
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button
                    onClick={() => {
                      deleteHabit(id, encodedToken);
                      handleClose();
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(event) => {
                      saveEditedHabit(id, encodedToken);
                      event.preventDefault();
                      handleClose();
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Habit;

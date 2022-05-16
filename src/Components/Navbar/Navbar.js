import "./navbar.css";
import { Box } from "@mui/system";
import { Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { useHabit } from "../../Context/habit-context";
import { useToken } from "../../Context/token-context";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    if (encodedToken !== null && encodedToken !== "") {
      localStorage.removeItem("ENCODED_TOKEN_3");
      setEncodedToken("");
      localStorage.removeItem("HABITS_ARRAY");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  let navigate = useNavigate();
  const {
    habitsArray,
    displayDate,
    habitDetails,
    setHabitDetails,
    saveNewHabit,
    habitStatusOnParticularDate,
    initialiseValuesBeforeAddHabit,
  } = useHabit();

  useEffect(() => {
    localStorage.setItem("HABITS_ARRAY", JSON.stringify(habitsArray));
  }, [habitsArray]);

  const [navHeader, setNavHeader] = useState("");

  useEffect(() => {
    if (window.location.pathname === "/") setNavHeader("Daily Habits");
    else if (window.location.pathname === "/habits/morning")
      setNavHeader("Morning");
    else setNavHeader("Archived");
  }, [window.location.pathname]);

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
  const { encodedToken, setEncodedToken } = useToken();

  return (
    <div className="Navbar">
      <div className="navbar-section">
        <span className="navbar-logo">{navHeader}</span>
        <ul>
          <li>
            <button
              onClick={() => {
                initialiseValuesBeforeAddHabit();
                handleOpen();
              }}
            >
              <span>+</span> Add Habit
            </button>
          </li>
          <li>
            <input
              value={displayDate}
              onChange={(event) => {
                habitStatusOnParticularDate(event);
              }}
              type="date"
              id="date-input"
            />
          </li>

          <li>
            <button onClick={handleLogout} className="btn-authenticate">
              {encodedToken === null || encodedToken === ""
                ? "Log In"
                : "Log Out"}
            </button>
          </li>
        </ul>
      </div>
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
              <button onClick={handleClose}>Cancel</button>
              <button
                disabled={habitDetails.name.length > 0 ? false : true}
                className={
                  habitDetails.name.length > 0 ? "btn-active" : "btn-disabled"
                }
                onClick={(event) => {
                  saveNewHabit(encodedToken);
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
  );
};

export default Navbar;

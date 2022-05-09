import { useContext, createContext, useState } from "react";
import uuid from "react-uuid";

const HabitContext = createContext();

const HabitProvider = ({ children }) => {
  const today = new Date();
  let todayDate = today.getDate();
  let todayMonth = today.getMonth() + 1;

  if (todayDate < 10) todayDate = "0" + todayDate;
  if (todayMonth < 10) todayMonth = "0" + todayMonth;

  var date = today.getFullYear() + "-" + todayMonth + "-" + todayDate;
  const [displayDate, setDisplayDate] = useState(date);

  let habitsArrayLocalStorage = JSON.parse(
    localStorage.getItem("HABITS_ARRAY")
  );
  if (habitsArrayLocalStorage === null) habitsArrayLocalStorage = [];
  const [habitsArray, setHabitsArray] = useState(habitsArrayLocalStorage);

  const [habitDetails, setHabitDetails] = useState({
    name: "",
    status: "",
    startDate: displayDate,
    endDate: displayDate,
    frequency: 1,
    timesOrMins: "Times",
    repeatCriteria: "Per Day",
    timeOfDay: "Any Time",
    completedTimes: 0,
    archived: false,
  });

  const compareDates = (date) => {
    const displayDateArray = displayDate.split("-");
    const dateArray = date.split("-");

    displayDateArray.map((displayDate) => parseInt(displayDate));
    dateArray.map((singleDate) => parseInt(singleDate));

    if (displayDateArray[0] > dateArray[0]) return 2;
    else if (displayDateArray[0] < dateArray[0]) return 0;
    else if (displayDateArray[0] === dateArray[0]) {
      if (displayDateArray[1] > dateArray[1]) return 2;
      else if (displayDateArray[1] < dateArray[1]) return 0;
      else if (displayDateArray[1] === dateArray[1]) {
        if (displayDateArray[2] > dateArray[2]) return 2;
        else if (displayDateArray[2] < dateArray[2]) return 0;
        else if (displayDateArray[2] === dateArray[2]) return 1;
      }
    }
  };

  const initialiseValuesBeforeAddHabit = () => {
    setHabitDetails({
      name: "",
      status: "",
      startDate: displayDate,
      endDate: displayDate,
      frequency: 1,
      timesOrMins: "Times",
      repeatCriteria: "Per Day",
      timeOfDay: "Any Time",
    });
  };

  const archiveHabit = (habitFound, encodedToken) => {
    const indexOfHabit = habitsArray.indexOf(habitFound);
    setHabitsArray([
      ...habitsArray.slice(0, indexOfHabit),
      {
        ...habitFound,
        archived: true,
      },
      ...habitsArray.slice(indexOfHabit + 1),
    ]);
    fetch(`/api/archives/${habitFound._id}`, {
      method: "POST",
      headers: {
        authorization: encodedToken,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const unarchiveHabit = (habitFound, encodedToken) => {
    const indexOfHabit = habitsArray.indexOf(habitFound);
    setHabitsArray([
      ...habitsArray.slice(0, indexOfHabit),
      {
        ...habitFound,
        archived: false,
      },
      ...habitsArray.slice(indexOfHabit + 1),
    ]);
    fetch(`/api/archives/restore/${habitFound._id}`, {
      method: "POST",
      headers: {
        authorization: encodedToken,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const markHabitComplete = (id) => {
    habitsArray.map((habit, index) => {
      if (habit._id === id) {
        habit.status.map((singleStatus) => {
          if (singleStatus.date === displayDate) {
            singleStatus.dailyStatus = "Completed";
          }
          return true;
        });
        setHabitsArray([
          ...habitsArray.slice(0, index),
          {
            ...habit,
            status: habit.status,
            completedTimes: habit.completedTimes + 1,
          },
          ...habitsArray.slice(index + 1),
        ]);
      }
      return true;
    });
  };

  const incrementCompleteCount = (id) => {
    habitsArray.map((habit, index) => {
      if (habit._id === id) {
        habit.status.map((singleStatus) => {
          if (singleStatus.date === displayDate) {
            if (habit.completedTimes < habit.frequency - 1)
              singleStatus.dailyStatus = "In Progress";
            else singleStatus.dailyStatus = "Completed";
          }
          return true;
        });
        setHabitsArray([
          ...habitsArray.slice(0, index),
          {
            ...habit,
            status: habit.status,
            completedTimes: habit.completedTimes + 1,
          },
          ...habitsArray.slice(index + 1),
        ]);
      }
      return true;
    });
  };

  const markHabitFail = (id) => {
    habitsArray.map((habit, index) => {
      if (habit._id === id) {
        habit.status.map((singleStatus) => {
          if (singleStatus.date === displayDate) {
            singleStatus.dailyStatus = "Failed";
          }
          return true;
        });
        setHabitsArray([
          ...habitsArray.slice(0, index),
          {
            ...habit,
            status: habit.status,
          },
          ...habitsArray.slice(index + 1),
        ]);
      }
      return true;
    });
  };

  const undoAction = (id) => {
    habitsArray.map((habit, index) => {
      if (habit._id === id) {
        habit.status.map((singleStatus) => {
          if (singleStatus.date === displayDate) {
            singleStatus.dailyStatus = "Incomplete";
          }
          return true;
        });
        setHabitsArray([
          ...habitsArray.slice(0, index),
          {
            ...habit,
            status: habit.status,
            completedTimes: 0,
          },
          ...habitsArray.slice(index + 1),
        ]);
      }
      return true;
    });
  };

  const saveNewHabit = (encodedToken) => {
    setHabitsArray([
      ...habitsArray,
      {
        _id: uuid(),
        name: habitDetails.name,
        frequency: habitDetails.frequency,
        timesOrMins: habitDetails.timesOrMins,
        repeatCriteria: habitDetails.repeatCriteria,
        timeOfDay: habitDetails.timeOfDay,
        startDate: habitDetails.startDate,
        endDate: habitDetails.endDate,
        archived: false,
        status: [
          {
            date: displayDate,
            dailyStatus: "Incomplete",
          },
        ],
        completedTimes: 0,
      },
    ]);
    fetch("/api/habits", {
      method: "POST",
      headers: {
        authorization: encodedToken,
      },
      body: JSON.stringify({
        habit: {
          _id: uuid(),
          name: habitDetails.name,
          frequency: habitDetails.frequency,
          timesOrMins: habitDetails.timesOrMins,
          repeatCriteria: habitDetails.repeatCriteria,
          timeOfDay: habitDetails.timeOfDay,
          startDate: habitDetails.startDate,
          endDate: habitDetails.endDate,
          archived: false,
          status: [
            {
              date: displayDate,
              dailyStatus: "Incomplete",
            },
          ],
          completedTimes: 0,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const editHabit = (id) => {
    habitsArray.map((habit) => {
      if (habit._id === id) {
        setHabitDetails({
          name: habit.name,
          status: habit.status,
          startDate: habit.startDate,
          endDate: habit.endDate,
          frequency: habit.frequency,
          timesOrMins: habit.timesOrMins,
          repeatCriteria: habit.repeatCriteria,
          timeOfDay: habit.timeOfDay,
        });
      }
      return true;
    });
  };

  const deleteHabit = (id, encodedToken) => {
    setHabitsArray(habitsArray.filter((habit) => habit._id !== id));
    fetch(`/api/habits/${id}`, {
      method: "DELETE",
      headers: {
        authorization: encodedToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const saveEditedHabit = (id, encodedToken) => {
    habitsArray.map((habit, index) => {
      if (habit._id === id) {
        setHabitsArray([
          ...habitsArray.slice(0, index),
          {
            ...habit,
            name: habitDetails.name,
            frequency: habitDetails.frequency,
            timesOrMins: habitDetails.timesOrMins,
            repeatCriteria: habitDetails.repeatCriteria,
            timeOfDay: habitDetails.timeOfDay,
            startDate: habitDetails.startDate,
            endDate: habitDetails.endDate,
          },
          ...habitsArray.slice(index + 1),
        ]);
        fetch(`/api/habits/${id}`, {
          method: "POST",
          headers: {
            authorization: encodedToken,
          },
          body: JSON.stringify({
            habit: {
              ...habit,
              name: habitDetails.name,
              frequency: habitDetails.frequency,
              timesOrMins: habitDetails.timesOrMins,
              repeatCriteria: habitDetails.repeatCriteria,
              timeOfDay: habitDetails.timeOfDay,
              startDate: habitDetails.startDate,
              endDate: habitDetails.endDate,
            },
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
      return true;
    });
  };

  const habitStatusOnParticularDate = (event) => {
    setDisplayDate(event.target.value);
    let dateFound;
    habitsArray.map((habit, index) => {
      dateFound = habit.status.find(
        (element) => element.date === event.target.value
      );
      if (!dateFound) {
        setHabitsArray([
          ...habitsArray.splice(0, index),
          {
            ...habit,
            status: [
              ...habit.status,
              {
                date: event.target.value,
                dailyStatus: "Incomplete",
              },
            ],
          },
          ...habitsArray.splice(index + 1),
        ]);
      }
      return true;
    });
  };

  return (
    <HabitContext.Provider
      value={{
        habitsArray,
        setHabitsArray,
        displayDate,
        setDisplayDate,
        habitDetails,
        setHabitDetails,
        compareDates,
        archiveHabit,
        unarchiveHabit,
        markHabitComplete,
        incrementCompleteCount,
        markHabitFail,
        undoAction,
        editHabit,
        deleteHabit,
        saveEditedHabit,
        saveNewHabit,
        habitStatusOnParticularDate,
        initialiseValuesBeforeAddHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

const useHabit = () => useContext(HabitContext);

export { useHabit, HabitProvider };

import Habit from "../Habit/Habit";
import "./habits.css";
import { useHabit } from "./../../Context/habit-context";
import { useEffect, useState } from "react";
import { useToken } from "../../Context/token-context";

const Habits = ({ morningHabits, archivedHabits }) => {
  const [quoteOfDay, setQuoteOfDay] = useState("");
  const { habitsArray, displayDate, compareDates } = useHabit();
  const { encodedToken } = useToken();

  const quotes = [
    {
      text: "It's easier to see the mistakes on someone else's paper.",
      author: null,
    },
    {
      text: "Every man dies. Not every man really lives.",
      author: null,
    },
    {
      text: "To lead people, walk behind them.",
      author: "Lao Tzu",
    },
    {
      text: "Having nothing, nothing can he lose.",
      author: "William Shakespeare",
    },
    {
      text: "Trouble is only opportunity in work clothes.",
      author: "Henry J. Kaiser",
    },
    {
      text: "A rolling stone gathers no moss.",
      author: "Publilius Syrus",
    },
    {
      text: "Ideas are the starting points of all fortunes.",
      author: "Napoleon Hill",
    },
    {
      text: "Doing nothing is better than being busy doing nothing.",
      author: "Lao Tzu",
    },
    {
      text: "Trust yourself. You know more than you think you do.",
      author: "Benjamin Spock",
    },
    {
      text: "Study the past, if you would divine the future.",
      author: "Confucius",
    },
    {
      text: "The day is already blessed, find peace within it.",
      author: null,
    },
    {
      text: "From error to error, one discovers the entire truth.",
      author: "Sigmund Freud",
    },
    {
      text: "Well done is better than well said.",
      author: "Benjamin Franklin",
    },
  ];

  useEffect(() => {
    fetch("/api/habits", {
      method: "GET",
      headers: {
        authorization: encodedToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data));
  }, []);

  useEffect(() => {
    var randomIndex = Math.floor(Math.random(1, quotes.length - 1) * 10);
    setQuoteOfDay(quotes[randomIndex].text);
    fetch("/api/archives", {
      method: "GET",
      headers: {
        authorization: encodedToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="Habits">
      <h3 className="quote-text">{quoteOfDay}</h3>
      {habitsArray.map((habit) => {
        let statusFound = habit.status.find(
          (element) => element.date === displayDate
        );
        return (
          <div key={habit._id}>
            {morningHabits === false &&
              archivedHabits === false &&
              habit.archived === false &&
              (compareDates(habit.startDate) === 2 ||
                compareDates(habit.startDate) === 1) &&
              (compareDates(habit.endDate) === 0 ||
                compareDates(habit.endDate) === 1) && (
                <Habit
                  archivedPage={false}
                  id={habit._id}
                  name={habit.name}
                  status={statusFound ? statusFound.dailyStatus : "Incomplete"}
                />
              )}

            {morningHabits &&
              habit.archived === false &&
              (compareDates(habit.startDate) === 2 ||
                compareDates(habit.startDate) === 1) &&
              (compareDates(habit.endDate) === 0 ||
                compareDates(habit.endDate) === 1) &&
              habit.timeOfDay === "Morning" && (
                <Habit
                  archivedPage={false}
                  id={habit._id}
                  name={habit.name}
                  status={statusFound ? statusFound.dailyStatus : "Incomplete"}
                />
              )}

            {archivedHabits &&
              habit.archived === true &&
              (compareDates(habit.startDate) === 2 ||
                compareDates(habit.startDate) === 1) &&
              (compareDates(habit.endDate) === 0 ||
                compareDates(habit.endDate) === 1) && (
                <Habit
                  archivedPage={true}
                  id={habit._id}
                  name={habit.name}
                  status={statusFound ? statusFound.dailyStatus : "Incomplete"}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

export default Habits;

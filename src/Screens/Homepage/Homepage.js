import "./homepage.css";
import Sidebar from "./../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import Habits from "../../Components/Habits/Habits";
import Pomodoro from "../../Components/Pomodoro/Pomodoro";

const Homepage = ({ morningHabits, archivedHabits }) => {
  return (
    <div className="Homepage">
      <Sidebar />
      <div className="homepage-body">
        <Navbar />
        {morningHabits === false && archivedHabits === false && (
          <Habits morningHabits={false} archivedHabits={false} />
        )}
        {morningHabits && <Habits morningHabits={true} />}
        {archivedHabits && <Habits archivedHabits={true} />}
      </div>
      <div>
        <Pomodoro />
      </div>
    </div>
  );
};

export default Homepage;

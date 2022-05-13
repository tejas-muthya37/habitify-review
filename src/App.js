import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Screens/Homepage/Homepage";
import Mockman from "mockman-js";
import Authenticate from "./Screens/Authenticate/Authenticate";
import RequiresAuth from "./RequiresAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mock" element={<Mockman />} />
        <Route
          path="/"
          element={
            <RequiresAuth>
              <Homepage morningHabits={false} archivedHabits={false} />
            </RequiresAuth>
          }
        />
        <Route
          path="/login"
          element={
            <Authenticate
              cardTitle="SIGN IN"
              alternate="Create A New Account"
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Authenticate
              cardTitle="SIGN UP"
              alternate="Login With Existing Account"
            />
          }
        />
        <Route
          path="/habits/morning"
          element={
            <RequiresAuth>
              <Homepage morningHabits={true} />
            </RequiresAuth>
          }
        />
        <Route
          path="/habits/archived"
          element={
            <RequiresAuth>
              <Homepage archivedHabits={true} />
            </RequiresAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

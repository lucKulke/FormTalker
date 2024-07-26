import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Hero } from "./components/home/hero";
import { Login } from "./components/auth/login";
import { SingUp } from "./components/auth/singUp";
import { NavigationBar } from "@/components/header/navbar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./services/supabase";
import { InspectionPlanFolders } from "./components/inspectionPlans/inspectionPlanFolders";

function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData); // Assuming `name` is in `user_metadata`
      } catch (error) {
        if (error instanceof Error) {
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <NavigationBar
        loggedIn={user ? true : false}
        setUser={setUser}
      ></NavigationBar>
      <Routes>
        <Route
          path="/login"
          element={<Login loggedIn={user ? true : false} setUser={setUser} />}
        />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/inspectionplans" element={<InspectionPlanFolders/>}/>
        <Route path="/" element={<Hero user={user} />} />
      </Routes>
    </div>
  );
}

export default App;

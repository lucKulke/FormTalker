import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Hero } from "@/components/home/hero";
import { Login } from "@/components/auth/login";
import { SingUp } from "@/components/auth/singUp";
import { NavigationBar } from "@/components/header/navbar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/supabase/auth";
import { InspectionPlanFolders } from "@/components/inspectionPlanFolders/inspectionPlanFolders";
import { CreateInspectionPlanFolder } from "@/components/inspectionPlanFolders/createInspectionPlanFolder";
import { pageLinks } from "@/utils/pageLinks";
import { InspectionPlanFolder } from "@/components/inspectionPlanFolders/inspectionPlanFolder";
import { NotFound } from "@/components/notFound";

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
    <div className="relative max-container">
      <NavigationBar
        loggedIn={user ? true : false}
        setUser={setUser}
      ></NavigationBar>
      <Routes>
        <Route
          path={pageLinks.signIn}
          element={<Login loggedIn={user ? true : false} setUser={setUser} />}
        />
        <Route path={pageLinks.signUp} element={<SingUp />} />
        <Route path={pageLinks.home} element={<Hero user={user} />} />{" "}
        <Route
          path={pageLinks.inspectionPlanFolders}
          element={<InspectionPlanFolders />}
        />
        <Route
          path={pageLinks.inspectionPlanFolderCreate}
          element={<CreateInspectionPlanFolder />}
        />
        <Route
          path={pageLinks.inspectionPlanFolder + ":id"}
          element={<InspectionPlanFolder />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

import "./App.css";
import FormTalkerIcon from "@/assets/formtalker.png";
import { NavigationBar } from "@/components/share/navbar";
import { Hero } from "@/components/home/hero.tsx";

function App() {
  return (
    <div className="container">
      <div className="mt-10">
        <ul className="flex space-x-12">
          <li>
            <img src={FormTalkerIcon} alt="icon" className="h-16 w-16"></img>
          </li>
          <li className="mt-3">
            <NavigationBar></NavigationBar>
          </li>
          <li></li>
        </ul>
        <Hero></Hero>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import HeroRobot from "@/assets/herorobot.png";
export function Hero() {
  return (
    <div className="flex justify-center mt-4 p-3">
      <div className="w-screen h-screen rounded-xl border-solid border-2 border-slate-100 flex justify-items-start p-7">
        <ul className="flex space-x-10">
          <li>
            <div className="flex container w-[450px] h-[450px] rounded-xl border-solid border-2 border-slate-200">
              <img src={HeroRobot} alt="" className="object-fill"></img>
            </div>
          </li>
          <li className="mt-10">
            <h1 className="text-xl font-bold">
              Fill your forms with the help of AI
            </h1>
            <p>
              Formtalker helps you to fill out your Inspection plans with the
              help of LLMs. <br />
              Test it now!
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

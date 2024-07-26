import React, { useEffect, useState } from "react";
import HeroRobot from "@/assets/herorobot.png";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/services/supabase";

interface HeroProps {
  user: any;
}

export function Hero({ user }: HeroProps) {
  console.log(user);
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
              Welcome {user ? user.email : "Guest"}
            </h1>
            <p>
              Formtalker helps you to fill out your Inspection plans with the
              help of LLMs. <br />
              Test it now!
            </p>
            {!user && (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

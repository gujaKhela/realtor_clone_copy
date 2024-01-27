import React, { useEffect, useState } from "react";
import siteLogo from "../assets/siteLogo.svg";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {

  const location = useLocation();
  const navigate = useNavigate();

  function matchPathName(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src={siteLogo}
            alt="logo of site"
            className={"h-5 cursor-pointer"}
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-9">
            <li
             className={"cursor-pointer py-3 text-sm font-semibold  " +
             (matchPathName("/") ? "text-black border-b-[3px] border-b-red-500" : "text-gray-400 border-b-[3px] border-b-transparent")
           }
           
              onClick={() => navigate("/")}
            >
              Home
            </li>

            <li
              className={"cursor-pointer py-3 text-sm font-semibold  " +
              (matchPathName("/offers") ? "text-black border-b-[3px] border-b-red-500" : "text-gray-400 border-b-[3px] border-b-transparent")}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={"cursor-pointer py-3 text-sm font-semibold  " +
             (matchPathName("/sign-in") ? "text-black border-b-[3px] border-b-red-500" : "text-gray-400 border-b-[3px] border-b-transparent")}
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

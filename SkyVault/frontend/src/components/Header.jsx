import React from "react";
import { MainMenu } from "./MainMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

export const Header = () => {
  return (
    <>
      <div className="fixed-top mb-5">
        <MainMenu />
      </div>
    </>
  );
};

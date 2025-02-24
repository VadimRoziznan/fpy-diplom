import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

export const Loading = () => {
  return (
    <div
      className="container mb-5 mt-5"
      style={{ paddingTop: "150px", paddingBottom: "50px", minHeight: "100vh" }}
    >
      <section className="top-sales">
        <div className="preloader text-center mt-5">
          <span className="spinner-border text-primary" role="status"></span>
        </div>
      </section>
    </div>
  );
};

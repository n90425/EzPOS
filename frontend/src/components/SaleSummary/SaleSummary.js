import React from "react";
import Sidebar from "./Sidebar";

import Dashboard from "./Dashboard";
import "../../css/salesummary/salesummary.css";
export function SaleSummary() {


  return (
  <div>
    <Sidebar />
    <div className="main">
      <Dashboard/>
    </div>
  </div>

  );
}



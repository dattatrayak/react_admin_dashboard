import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/header";

const Layout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div style={{ flex: 1 }}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

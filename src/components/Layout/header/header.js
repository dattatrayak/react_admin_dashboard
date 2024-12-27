import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material"; 
import MenuIcon from "@mui/icons-material/Menu";
const Header = ({ isSidebarOpen, toggleSidebar }) => (
  <AppBar position="static">
     <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}> 
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleSidebar}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton> 
      <Typography variant="h6" noWrap>
        {isSidebarOpen ? "Admin Panel" : "Admin Panel"}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;

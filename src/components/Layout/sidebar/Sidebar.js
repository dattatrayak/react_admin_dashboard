import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Toolbar,
  Typography, 
  Box,
} from "@mui/material";
import { 
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import * as MaterialIcons from "@mui/icons-material"; // Import all Material-UI icons
import DefaultIcon from "@mui/icons-material/HelpOutline"; // Fallback icon 
import fetchMenuList from "../../../services/fetchMenuList";
import { useNavigate } from "react-router-dom";
const Sidebar = ({isSidebarOpen}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
 // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null); // Track the active menu
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await fetchMenuList();
        setMenuItems(menuData); // Set the menu data in state 
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleToggle = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleMenuClick = (url, menuItem) => {
    url = url.replace(/^admin\//, "");
    navigate(url, { state: { menu: menuItem } }); // Pass menu object as state
  };

  const getIcon = (iconName, isActive) => {
    const IconComponent = MaterialIcons[iconName];
    const color = isActive ? "#3498db" : "#ffffff"; // Active: Orange, Default: White
    return IconComponent ? <IconComponent sx={{ color }} /> : <DefaultIcon sx={{ color }} />;
  };

  const renderMenu = (items) => {
    return items.map((item) => {
      const isActive = activeMenu === item.id;

      return (
        <React.Fragment key={item.id}>
          <ListItem 
            onClick={() => {
              setActiveMenu(item.id);
             
              if (item.SubMenus.length > 0) handleToggle(item.id);
             // if (item.SubMenus.length > 0)  handleMenuClick(item.url, item);
            }}
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: isSidebarOpen ? "flex-start" : "center",
              alignItems: "center", // Ensures alignment of icons and text
              padding: isSidebarOpen ? "5px 8px" : "5px", // Adjust padding
              "&:hover": {
                backgroundColor: "#424242", // Change background on hover
              },
            }}
          >
            <ListItemIcon
              sx={{
                justifyContent: "center",
                minWidth: isSidebarOpen ? "30px" : "38px", // Adjust minimum width
                color: isActive ? "#3498db" : "#ffffff", // Dynamic color
              }}
            >
              {getIcon(item.icon, isActive)}
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText
                primary={item.name}
                sx={{
                  cursor: "pointer",
                  marginLeft: "0px", // Adjust space between icon and text
                  color: "#fff", // Text color
                }}
                onClick={() => { 
                  handleMenuClick(item.url, item);
                }}
              />
            )}
            {item.SubMenus.length > 0 &&
              (openMenus[item.id] ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>

          {item.SubMenus.length > 0 && (
            <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding  
              sx={{
                    backgroundColor: "rgba(74, 98, 185, 0.1)",
                    paddingLeft:"8px", // Change color for collapsed items
                    "& .MuiListItemText-primary": {
                      color: "#fff", // Change text color inside collapse
                    },  
                }}
              >
                {renderMenu(item.SubMenus)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? 250 : 65,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSidebarOpen ? 250 : 65,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #2b2e4a, #23242a)",
            color: "#fff",
            overflowX: "hidden",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isSidebarOpen ? "space-between" : "center",
            alignItems: "center",
            padding: 1,
          }}
        >
          {isSidebarOpen ? (
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          ) : (
            <Typography variant="h6"  >
             DK
            </Typography>
          )} 
        </Toolbar>

        <List>{renderMenu(menuItems)}</List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
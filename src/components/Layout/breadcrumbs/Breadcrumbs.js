import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material"; 
import { useLocation, useNavigate } from "react-router-dom";
import { fetchBreadcrumb } from "../../../services/fetchMenuList";

const BreadcrumbsComponent = () => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
 const page = location.state; 
  useEffect(() => {
    // Fetch the breadcrumb data from the API
    const fetchBreadcrumbs = async () => {
      try { 
        const params = {
            url: page.menu.url 
        }
            const response = await fetchBreadcrumb(params); 
            setBreadcrumbs(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumbs:", error);
      }
    };
    if(breadcrumbs.length === 0)
    fetchBreadcrumbs();
    
  });

  // Handle breadcrumb click to navigate to the respective URL
  const handleClick = (url) => {
    navigate(url);
  }; 

return (
    <div>
        <Typography variant="h4" sx={{ marginBottom: 0 }}>
            { (page.menu.heading) ? page.menu.heading : page.menu.name }
        </Typography> 
      <Breadcrumbs aria-label="breadcrumb" sx={{
        marginBottom: 2,
        "& .MuiBreadcrumbs-separator": {
          color: "#f6f50e",
        },
        "& .MuiLink-root": {
          color: "#f6f50e",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            color: "#cfce05",
          },
        },
        "& .MuiTypography-root": {
          fontWeight: "normal", 
          color: "#ebeba3",
        },
      }}>
        <Link color="inherit" onClick={() => handleClick("/")}>
          Home
        </Link> 
        {breadcrumbs.map((crumb, index) => (
          <Link
            key={index}
            color="inherit"
            onClick={() => handleClick(crumb.url)}
            sx={{ cursor: "pointer" }}
          >
            {crumb.name}
          </Link>
        ))}
        
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,FormHelperText
} from "@mui/material";
import { fetchParentDropdown, saveMenu, updateMenu } from "../../services/fetchMenuList"; // Update with your actual import

const UserForm = ({ menu, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    heading: "",
    url: "",
    icon: "",
    order: "",
    parent_id: "", // Default value for parent_id
  });
  const [parentMenus, setParentMenus] = useState([]);

  useEffect(() => {
    if (menu) {
      setFormData(menu);
    }

    // Fetch parent menus for the dropdown
    const fetchParentMenus = async () => {
      try {
        const response = await fetchParentDropdown(); // Fetching parent menu data
        setParentMenus(response); // Assuming 'response.data' contains the menu data
      } catch (error) {
        console.error("Error fetching parent menus:", error);
      }
    };

    fetchParentMenus();
  }, [menu]);

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    console.log( name, value );
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (menu?.id) {
         await updateMenu(menu.id, formData);
      } else {
        await saveMenu(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

 
const renderMenuItems = (items, level = 0) => {
    return items.flatMap((item) => [
      <MenuItem key={item.id} value={item.id} style={{ paddingLeft: level * 20 }}>
        {item.name}
      </MenuItem>,
      ...(item.children ? renderMenuItems(item.children, level + 1) : [])
    ]);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="URL"
            name="url"
            value={formData.url}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            fullWidth
          />
          <FormHelperText>https://mui.com/material-ui/material-icons/</FormHelperText>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="parent-menu-label">Parent Menu</InputLabel>
            <Select
              labelId="parent-menu-label"
              name="parent_id"
              value={formData.parent_id || ""}  // Ensure value is correctly matched
              onChange={handleChange}
            >
              <MenuItem value="">None</MenuItem>
              {/* Render parent-child menu items */}
              {renderMenuItems(parentMenus)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onCancel} sx={{ ml: 2 }} variant="outlined">
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm; 
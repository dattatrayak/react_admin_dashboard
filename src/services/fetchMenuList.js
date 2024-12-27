import { get,post,put } from "../api/apiService";

 

// Fetch Menu List
const fetchMenuList = async () => {
  try {
    const response = await get("/admin/menulist");
    
    return response; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};

export const fetchMenuListCrud = async (parems) => {
  try { 
    const response = await get("/admin/menus",parems); 
    return response; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export const fetchBreadcrumb = async (parems) => {
  try { 
    const response = await post("/admin/breadcrumb",parems); 
    return response; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export const fetchParentDropdown = async () => {
  try { 
    const response = await get("/admin/menu-dropdown"); 
    return response.data; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};

export const saveMenu = async (params) => {
  try { 
    const response = await post("/admin/menu",params); 
    return response.data; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export const updateMenu = async (id, params) => {
  try { 
    const response = await put("/admin/menu/"+id, params); 
    return response.data; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export default fetchMenuList;
import { get,post,put } from "../api/apiService";

export const userLogin = async (params) => {
  try {
    const response = await post("/admin/login",params);
    
    return response; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};

// Fetch Menu List
const fetchUserList = async (params) => {
  try {
    const response = await get("/admin/users",params);
    
    return response; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
   
export const createUser = async (params) => {
  try { 
    const response = await post("/admin/users",params); 
    return response.data; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export const updateUser = async (id, params) => {
  try { 
    const response = await put("/admin/users/"+id, params); 
    return response.data; // Return the menu data
  } catch (error) { 
    throw error; // Re-throw error to handle it at the caller level
  }
};
export default fetchUserList;
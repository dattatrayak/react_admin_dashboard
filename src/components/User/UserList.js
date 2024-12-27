import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  TablePagination,
} from "@mui/material";
import fetchUserList, { createUser, updateUser } from "../../services/userServices";
import CustomBreadcrumbs from "../Layout/breadcrumbs/Breadcrumbs";
const UserCrud = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState(""); // Search query
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
        email: "",
        password: "",
        userType: "",
      });

   const newErrors = {};

  useEffect(() => {
    loadUsers(search, page, rowsPerPage);
  }, [search, page, rowsPerPage]);

  const handleResetClick = () => {
    setSearch(""); // Clear search input
    setPage(0); // Reset to the first page
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {

    setSearch(e.target.value);
    setPage(0);
  };

  const handleSearchClick = () => {
    setSearch(search);
    setPage(0);
  };

  const loadUsers = async (search, page, rowsPerPage) => {
    try {
      const data = {
        "page ": page,
        "limit": rowsPerPage,
        "search": search
      }
      const response = await fetchUserList(data);
      setUsers(response.data);
      setTotalItems(response.totalItems);
    } catch (error) {
      setUsers([]);
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
  
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = `Password must have at least 8 characters,
                              including one uppercase letter, 
                              one lowercase letter, one number, 
                              and one special character.`;
    }

    if (!formData.userType) {
      newErrors.userType = "User Type is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData); 
      }
      setOpen(false);
      setEditingUser(null);
      setFormData({ email: "", password: "", userType: "" });
      loadUsers();
    } catch (error) {
      //console.log(error.response.data.errors.errors);
     if (error.response && error.response.data.errors) {
        // Map server-side validation errors to the form
        const serverErrors = {};
        error.response.data.errors.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      // await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setOpen(true);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0px"
      >
        <CustomBreadcrumbs />
        <Button
          variant="contained"
          background="#fff"
          color="primary"
          sx={{
            textTransform: "none",
            height: "40px",
            marginLeft: "16px",
          }}
          onClick={() => setOpen(true)}>
          Add User
        </Button>
      </Box>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetClick}>
            Reset
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>User Type</strong></TableCell>
                <TableCell><strong>Email Valid</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>#</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>{user.email_validation}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEdit(user)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button variant="text" color="error"
                      onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="User Type"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.userType}
            helperText={errors.userType}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserCrud;

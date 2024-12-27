import React, { useState, useEffect } from "react";
import { TablePagination, TableContainer, Paper, TextField, Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
//import { fetchMenuListCrud } from "../../services/fetchMenuList";
import CustomBreadcrumbs from "../Layout/breadcrumbs/Breadcrumbs";
import MenuForm from "./MenuForm"; 
import { fetchMenuListCrud } from "../../services/fetchMenuList";
const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(""); // Search query
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchMenu = async (search, page, rowsPerPage) => {
    try {
      page = page + 1;
      const data = {
        "page ": page,
        "limit": rowsPerPage,
        "search": search
      }
       
      const menuData = await fetchMenuListCrud(data);
    
      setMenus(menuData.menus);
      setTotalItems(menuData.totalItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  const handleResetClick = () => {
    setSearch(""); // Clear search input
    setPage(0); // Reset to the first page
  };

  useEffect(() => {
    fetchMenu(search, page, rowsPerPage);
  }, [search, page, rowsPerPage]);

  const handleAddClick = () => {
    setSelectedMenu(null); // Reset the selected menu for adding a new item
    setIsFormOpen(true); // Open the form
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
  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setIsFormOpen(true);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };
  const handleSave = () => {
    setIsFormOpen(false);
    fetchMenu(search, page, rowsPerPage);
  };
  return (
    <Box p={0}>
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
          onClick={handleAddClick}
          sx={{
            textTransform: "none",
            height: "40px",
            marginLeft: "16px",
          }}
        >
          Add
        </Button>
      </Box>
       
      {isFormOpen && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <MenuForm menu={selectedMenu} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </Paper>
      )}
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
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>URL</strong></TableCell>
                <TableCell><strong>Icon</strong></TableCell>
                <TableCell><strong>Order</strong></TableCell>
                <TableCell><strong>#</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{menu.url}</TableCell>
                  <TableCell>{menu.icon}</TableCell>
                  <TableCell>{menu.order}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(menu)} variant="text">
                      Edit
                    </Button>
                    <Button variant="text" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))} 
              {menus.length === 0 && (
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
    </Box>
  );
};

export default MenuList;

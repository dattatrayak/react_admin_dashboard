import Dashboard from "../components/dashboard/Dashboard";
import Layout from "../components/Layout/Layout";
import Login from "../pages/Login/index";
//import ProtectedLayout from "../components/Layout/ProtectedLayout"; // Protects routes under /admin
import MenuList from "../components/Menu/MenuList"; 
import UserList from "../components/User/UserList";

 const routes = [
  {
    path: "/admin",
    // element: (
    //   <ProtectedLayout>
    //     <Layout />
    //   </ProtectedLayout>
    // ),
   element: <Layout /> ,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "menu", element: <MenuList /> },
      { path: "users", element: <UserList /> },
      { path: "", element: <Dashboard /> },
      // { path: "users", element: <UserManagement /> },
      // { path: "other", element: <OtherPage /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]; 
export default routes;
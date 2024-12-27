import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import axios from "axios";
import './login.scss';
import { userLogin } from "../../services/userServices";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError("");
        try {

            const response = await userLogin({
                "email": username,
                password,
            }); // Fetching parent menu data 
            if (response.success) {
                localStorage.setItem("auth", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                window.location.href = "/admin/dashboard"; // Navigate to the dashboard
            } else {
                setError("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error fetching parent menus:", error);
        }

    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Box
                bgcolor="white"
                padding={4}
                borderRadius={2}
                boxShadow={3}
                width="400px"
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Login;

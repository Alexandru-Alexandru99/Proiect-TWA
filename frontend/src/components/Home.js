import React from 'react'
import { useState, useEffect, useRef } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom"

import IconHome from "../images/red-carpet.png"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home() {
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [toastMessage, setToastMessage] = useState("");
    const [errorTitle, setErrorTitle] = useState("");

    function alertProperties(status, type, title, message) {
        setOpen(false);
        setOpen(status);
        setAlertType(type);
        setErrorTitle(title);
        setToastMessage(message)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const navigate = useNavigate();
    function handleLogout() {
        axios.post("http://localhost:5000/logout")
            .then(res => {
                console.log(res.data);
                navigate("/")
                alertProperties(true, "success", "Success", "Successfully logout!");
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    <AlertTitle>{errorTitle}</AlertTitle>
                    {toastMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: "#22272e" }}>
                    <Toolbar>
                        <Typography style={{ color: "#adbac7" }} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            EventsNOC
                        </Typography>
                        <Button color="inherit" ><Link style={{ color: "#adbac7" }} to="/shop">Shop</Link></Button>
                        <Button color="inherit" ><Link style={{ color: "#adbac7" }} to="/signup">Sign Up</Link></Button>
                        <Button color="inherit"><Link style={{ color: "#adbac7" }} to="/login">Login</Link></Button>
                        <Button color="inherit"><Link style={{ color: "#adbac7" }} to="/forgot-password">Forgot Password</Link></Button>
                        <Button color="inherit"><Link style={{ color: "#adbac7" }} onClick={handleLogout}>Logout</Link></Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <img style={{ paddingTop: "18%", paddingLeft: "45%" }} src={IconHome} alt="IconHome" />
        </>
    );
}

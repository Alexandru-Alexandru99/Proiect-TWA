import * as React from 'react';
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar"
import Box from '@mui/material/Box';
import axios from "axios"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import UserList from "../images/user_list.png"

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Users() {
    const [users, setUsers] = React.useState([]);
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

    useEffect(() => {
        if (users == 0)
            axios.get("http://localhost:5000/getallusers", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.users);
                    setUsers(res.data.users)
                })
                .catch(err => {
                    console.log(err);
                });
    });

    function handleDeleteUser(first_name, last_name, email_address) {
        axios.post("http://localhost:5000/deleteuser", {
            first_name: first_name,
            last_name: last_name,
            email_address: email_address
        })
        .then(res => {
            console.log(res.data);
            window.location.reload(false);
        })
        .catch(err => {
            console.log(err);
            alertProperties(true, "error", "Error", "Forbidden Access!");
        });
    }

    return (
        <>
            <Sidebar style={{ position: 'absolute' }}></Sidebar>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    <AlertTitle>{errorTitle}</AlertTitle>
                    {toastMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ width: '100%', typography: 'body1', marginLeft: "200px", paddingRight: "400px", paddingTop: "50px" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Register date</TableCell>
                                <TableCell align="right">First name</TableCell>
                                <TableCell align="right">Last name</TableCell>
                                <TableCell align="right">Email address</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((item) => (
                                <TableRow
                                    // key={item.theatre_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <img style={{ paddingRight: "10px" }} src={UserList} alt="UserList" />
                                        {item.register_date}
                                    </TableCell>
                                    <TableCell align="right">{item.first_name}</TableCell>
                                    <TableCell align="right">{item.last_name}</TableCell>
                                    <TableCell align="right">{item.email_address}</TableCell>
                                    <TableCell align="right">
                                        {item.email_address != localStorage.getItem("email") ?
                                            <Button color="inherit" style={{ backgroundColor: "coral" }} onClick={() => handleDeleteUser(item.first_name, item.last_name, item.email_address)}><b>Delete</b></Button>
                                            : <></>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar"
import Box from '@mui/material/Box';
import axios from "axios"
import { useNavigate } from "react-router-dom"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiButton from '@mui/material/Button';

import UserList from "../images/user_list.png"

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { Form, Button } from "react-bootstrap"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Users() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const usertypeRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        if (usertypeRef.current.value == "admin") {
            axios.defaults.withCredentials = true;
            axios.post("http://localhost:5000/addadminuser", {
                password: passwordRef.current.value,
                email_address: emailRef.current.value,
                first_name: firstNameRef.current.value,
                last_name: lastNameRef.current.value
            }, {
                withCredentials: true
            })
                .then(res => {
                    console.log(res);
                    alertProperties(true, "success", "Success", "Successfully added!");
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            axios.defaults.withCredentials = true;
            axios.post("http://localhost:5000/signup", {
                password: passwordRef.current.value,
                email_address: emailRef.current.value,
                first_name: firstNameRef.current.value,
                last_name: lastNameRef.current.value
            }, {
                withCredentials: true
            })
                .then(res => {
                    console.log(res);
                    alertProperties(true, "success", "Success", "Successfully added!");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

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
                                <TableCell align="right">User type</TableCell>
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
                                    <TableCell align="right">{item.user_type}</TableCell>
                                    <TableCell align="right">
                                        {item.email_address != localStorage.getItem("email") ?
                                            <MuiButton color="inherit" style={{ backgroundColor: "coral" }} onClick={() => handleDeleteUser(item.first_name, item.last_name, item.email_address)}><b>Delete</b></MuiButton>
                                            : <></>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br></br>
                <div style={{ color: "#adbac7", width: "300px" }}>
                    <p><b>Add user/admin</b></p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Form.Group id="firstname">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" ref={firstNameRef} required />
                        </Form.Group>
                        <Form.Group id="lastname">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" ref={lastNameRef} required />
                        </Form.Group>
                        <Form.Group id="usertype">
                            <Form.Label>User type</Form.Label>
                            <Form.Control type="text" ref={usertypeRef} required />
                        </Form.Group>
                        <br></br>
                        <Button disabled={loading} className="w-100" type="submit">
                            Add
                        </Button>
                    </Form>
                </div>
            </Box>
        </>
    )
}

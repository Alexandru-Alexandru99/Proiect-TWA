import * as React from 'react';
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from "axios"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import MatchIcon from "../images/football.png"
import CinemaIcon from "../images/movie.png"
import TheatreIcon from "../images/theatre.png"

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Transactions() {
    const [value, setValue] = React.useState('1');
    const [matchesTransactions, setMatchesTransactions] = React.useState([]);
    const [cinemaTransactions, setCinemaTransactions] = React.useState([]);
    const [theatreTransactions, setTheatreTransactions] = React.useState([]);

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
        if (matchesTransactions == 0)
            axios.get("http://localhost:5000/getalltransactionsmatches", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.match_transactions);
                    setMatchesTransactions(res.data.match_transactions)
                })
                .catch(err => {
                    console.log(err);
                });
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue == 1) {
            axios.get("http://localhost:5000/getalltransactionsmatches", {
                withCredentials: true
            })
                .then(res => {
                    setMatchesTransactions(res.data.match_transactions)
                    console.log(res.data.match_transactions)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
        if (newValue == 2) {
            axios.get("http://localhost:5000/getalltransactioncinema", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.cinema_transactions);
                    setCinemaTransactions(res.data.cinema_transactions)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
        if (newValue == 3) {
            axios.get("http://localhost:5000/getalltransactiontheatre", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.theatre_transactions);
                    setTheatreTransactions(res.data.theatre_transactions)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
    };
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
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab style={{color:"#adbac7"}} label="Matches" value="1" />
                            <Tab style={{color:"#adbac7"}} label="Cinema" value="2" />
                            <Tab style={{color:"#adbac7"}} label="Theatre" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event date</TableCell>
                                        <TableCell align="right">Team 1</TableCell>
                                        <TableCell align="right">Team 2</TableCell>
                                        <TableCell align="right">Email</TableCell>
                                        <TableCell align="right">Tickets bought</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {matchesTransactions.map((item, index) => (
                                        <TableRow
                                            key={item.match_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={MatchIcon} alt="MatchIcon" />
                                                {item.event_date}
                                            </TableCell>
                                            <TableCell align="right">{item.team_1}</TableCell>
                                            <TableCell align="right">{item.team_2}</TableCell>
                                            <TableCell align="right">{item.email}</TableCell>
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event date</TableCell>
                                        <TableCell align="right">Film</TableCell>
                                        <TableCell align="right">Genre</TableCell>
                                        <TableCell align="right">Email</TableCell>
                                        <TableCell align="right">Tickets bought</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cinemaTransactions.map((item) => (
                                        <TableRow
                                            key={item.cinema_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={CinemaIcon} alt="MatchIcon" />
                                                {item.event_date}
                                            </TableCell>
                                            <TableCell align="right">{item.film}</TableCell>
                                            <TableCell align="right">{item.genre}</TableCell>
                                            <TableCell align="right">{item.email}</TableCell>
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event date</TableCell>
                                        <TableCell align="right">Name</TableCell>
                                        <TableCell align="right">Email</TableCell>
                                        <TableCell align="right">Tickets bought</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {theatreTransactions.map((item) => (
                                        <TableRow
                                            key={item.theatre_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={TheatreIcon} alt="MatchIcon" />

                                                {item.event_date}
                                            </TableCell>
                                            <TableCell align="right">{item.name}</TableCell>
                                            <TableCell align="right">{item.email}</TableCell>
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

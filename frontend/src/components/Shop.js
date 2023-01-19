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


export default function Shop() {
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

    const [value, setValue] = React.useState('1');
    const [matches, setMatches] = React.useState([]);
    const [cinema, setCinema] = React.useState([]);
    const [theatre, setTheatre] = React.useState([]);

    const [ticketsM, setTicketsM] = React.useState(0);
    const [ticketsC, setTicketsC] = React.useState(0);
    const [ticketsT, setTicketsT] = React.useState(0);

    function handleBuyTicketMatch(date, team_1, team_2) {
        if (ticketsM != 0) {
            axios.get("http://localhost:5000/getmatchticket", {
                params: {
                    date: date,
                    team_1: team_1,
                    team_2: team_2,
                    user_email: localStorage.getItem("email"),
                    requested_tickets: ticketsM
                }
            })
                .then(res => {
                    console.log(res.data);
                    setTicketsM(0);
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
    }

    function handleBuyTicketCinema(date, film) {
        if (ticketsC != 0) {
            axios.get("http://localhost:5000/getcinematicket", {
                params: {
                    date: date,
                    film: film,
                    user_email: localStorage.getItem("email"),
                    requested_tickets: ticketsC
                }
            })
                .then(res => {
                    console.log(res.data);
                    setTicketsC(0);
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
    }

    function handleBuyTicketTheatre(date, name) {
        if (ticketsT != 0) {
            axios.get("http://localhost:5000/gettheatreticket", {
                params: {
                    date: date,
                    name: name,
                    user_email: localStorage.getItem("email"),
                    requested_tickets: ticketsT
                }
            })
                .then(res => {
                    console.log(res.data);
                    setTicketsT(0);
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
    }

    function handleTicketsM(e) {
        setTicketsM(e.target.value)
    }

    function handleTicketsC(e) {
        setTicketsC(e.target.value)
    }

    function handleTicketsT(e) {
        setTicketsT(e.target.value)
    }

    useEffect(() => {
        if (matches == 0)
            axios.get("http://localhost:5000/getmatchevents", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.matches);
                    setMatches(res.data.matches)
                })
                .catch(err => {
                    console.log(err);
                });
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue == 1) {
            axios.get("http://localhost:5000/getmatchevents", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.matches);
                    setMatches(res.data.matches)
                    console.log(matches)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
        if (newValue == 2) {
            axios.get("http://localhost:5000/getcinemaevents", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.movies);
                    setCinema(res.data.movies)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
        if (newValue == 3) {
            axios.get("http://localhost:5000/gettheatreevents", {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.theatre_events);
                    setTheatre(res.data.theatre_events)
                })
                .catch(err => {
                    console.log(err);
                    alertProperties(true, "error", "Error", "Forbidden Access!");
                });
        }
    };
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    <AlertTitle>{errorTitle}</AlertTitle>
                    {toastMessage}
                </Alert>
            </Snackbar>
            <Sidebar style={{ position: 'absolute' }}></Sidebar>
            <Box sx={{ width: '100%', typography: 'body1', marginLeft: "200px", paddingRight: "400px", paddingTop: "50px" }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab style={{ color: "#adbac7" }} label="Matches" value="1" />
                            <Tab style={{ color: "#adbac7" }} label="Cinema" value="2" />
                            <Tab style={{ color: "#adbac7" }} label="Theatre" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TextField sx={{ input: { color: 'white' } }} id="outlined-basic" label="Number of tickets" variant="outlined" onChange={handleTicketsM} />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Team 1</TableCell>
                                        <TableCell align="right">Team 2</TableCell>
                                        <TableCell align="right">Ticket price</TableCell>
                                        <TableCell align="right">Number of tickets</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {matches.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={MatchIcon} alt="MatchIcon" />

                                                {item.date}
                                            </TableCell>
                                            <TableCell align="right">{item.team_1}</TableCell>
                                            <TableCell align="right">{item.team_2}</TableCell>
                                            <TableCell align="right">{item.ticket_price}</TableCell>
                                            <TableCell align="right">{item.number_of_tickets}</TableCell>
                                            <TableCell align="right"><Button color="inherit" style={{ backgroundColor: "#2ca460" }} onClick={() => handleBuyTicketMatch(item.date, item.team_1, item.team_2)}><b>Buy</b></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                        <TextField sx={{ input: { color: 'white' } }} id="outlined-basic" label="Number of tickets" variant="outlined" onChange={handleTicketsC} />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Film</TableCell>
                                        <TableCell align="right">Genre</TableCell>
                                        <TableCell align="right">Lead studio</TableCell>
                                        <TableCell align="right">Year</TableCell>
                                        <TableCell align="right">Ticket price</TableCell>
                                        <TableCell align="right">Number of tickets</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cinema.map((item) => (
                                        <TableRow
                                            // key={item.date}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={CinemaIcon} alt="MatchIcon" />

                                                {item.date}
                                            </TableCell>
                                            <TableCell align="right">{item.film}</TableCell>
                                            <TableCell align="right">{item.genre}</TableCell>
                                            <TableCell align="right">{item.lead_studio}</TableCell>
                                            <TableCell align="right">{item.year}</TableCell>
                                            <TableCell align="right">{item.ticket_price}</TableCell>
                                            <TableCell align="right">{item.number_of_tickets}</TableCell>
                                            <TableCell align="right"><Button color="inherit" style={{ backgroundColor: "#2ca460" }} onClick={() => handleBuyTicketCinema(item.date, item.film)}><b>Buy</b></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                        <TextField sx={{ input: { color: 'white' } }} id="outlined-basic" label="Number of tickets" variant="outlined" onChange={handleTicketsT} />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Name</TableCell>
                                        <TableCell align="right">Place</TableCell>
                                        <TableCell align="right">Type</TableCell>
                                        <TableCell align="right">Ticket price</TableCell>
                                        <TableCell align="right">Number of tickets</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {theatre.map((item) => (
                                        <TableRow
                                            // key={item.date}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={TheatreIcon} alt="MatchIcon" />

                                                {item.date}
                                            </TableCell>
                                            <TableCell align="right">{item.name}</TableCell>
                                            <TableCell align="right">{item.place}</TableCell>
                                            <TableCell align="right">{item.type}</TableCell>
                                            <TableCell align="right">{item.ticket_price}</TableCell>
                                            <TableCell align="right">{item.number_of_tickets}</TableCell>
                                            <TableCell align="right"><Button color="inherit" style={{ backgroundColor: "#2ca460" }} onClick={() => handleBuyTicketTheatre(item.date, item.name)}><b>Buy</b></Button></TableCell>
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

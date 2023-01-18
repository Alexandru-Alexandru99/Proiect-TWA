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

import MatchIcon from "../images/football.png"
import CinemaIcon from "../images/movie.png"
import TheatreIcon from "../images/theatre.png"

export default function Profile() {
    const [value, setValue] = React.useState('1');
    const [matches, setMatches] = React.useState([]);
    const [cinema, setCinema] = React.useState([]);
    const [theatre, setTheatre] = React.useState([]);

    function handleRefundTicketM(match_id, tickets_bought) {
        axios.post("http://localhost:5000/refundmatchticket", {
            match_id: match_id,
            tickets_bought: tickets_bought,
            email: localStorage.getItem("email")
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleRefundTicketC(cinema_id, tickets_bought) {
        axios.post("http://localhost:5000/refundcinematicket", {
            cinema_id: cinema_id,
            tickets_bought: tickets_bought,
            email: localStorage.getItem("email")
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleRefundTicketT(theatre_id, tickets_bought) {
        axios.post("http://localhost:5000/refundtheatreticket", {
            theatre_id: theatre_id,
            tickets_bought: tickets_bought,
            email: localStorage.getItem("email")
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue == 1) {
            axios.get("http://127.0.0.1:5000/getyourmatches", {
                params: {
                    email: localStorage.getItem("email")
                }
            })
                .then(res => {
                    console.log(res.data.your_matches);
                    setMatches(res.data.your_matches)
                    console.log(matches)
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (newValue == 2) {
            axios.get("http://127.0.0.1:5000/getyourcinema", {
                params: {
                    email: localStorage.getItem("email")
                }
            })
                .then(res => {
                    console.log(res.data.your_cinema_events);
                    setCinema(res.data.your_cinema_events)
                })
                .catch(err => {
                    console.log(err);
                });
        }
        if (newValue == 3) {
            axios.get("http://127.0.0.1:5000/getyourtheatre", {
                params: {
                    email: localStorage.getItem("email")
                }
            })
                .then(res => {
                    console.log(res.data.your_theatre_events);
                    setTheatre(res.data.your_theatre_events)
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
    return (
        <>
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
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event date</TableCell>
                                        <TableCell align="right">Team 1</TableCell>
                                        <TableCell align="right">Team 2</TableCell>
                                        <TableCell align="right">Tickets bought</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {matches.map((item) => (
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
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                            <TableCell align="right">
                                                <Button color="inherit" style={{ backgroundColor: "green" }} onClick={() => handleRefundTicketM(item.match_id, item.tickets_bought)}>Refund</Button>
                                            </TableCell>
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
                                        <TableCell align="right">Tickets bought</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cinema.map((item) => (
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
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                            <TableCell align="right">
                                                <Button color="inherit" style={{ backgroundColor: "green" }} onClick={() => handleRefundTicketC(item.cinema_id, item.tickets_bought)}>Refund</Button>
                                            </TableCell>
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
                                        <TableCell align="right">Tickets bought</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {theatre.map((item) => (
                                        <TableRow
                                            key={item.theatre_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <img style={{ paddingRight: "10px" }} src={TheatreIcon} alt="MatchIcon" />

                                                {item.event_date}
                                            </TableCell>
                                            <TableCell align="right">{item.name}</TableCell>
                                            <TableCell align="right">{item.tickets_bought}</TableCell>
                                            <TableCell align="right">
                                                <Button color="inherit" style={{ backgroundColor: "green" }} onClick={() => handleRefundTicketT(item.theatre_id, item.tickets_bought)}>Refund</Button>
                                            </TableCell>
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

import React, { useRef, useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from "axios"
import { Form, Button, Card } from "react-bootstrap"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiButton from '@mui/material/Button';
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

export default function ManageEvents() {
    const [value, setValue] = React.useState('1');
    const [matches, setMatches] = React.useState([]);
    const [cinema, setCinema] = React.useState([]);
    const [theatre, setTheatre] = React.useState([]);

    const [ticketsM, setTicketsM] = React.useState(0);
    const [ticketsC, setTicketsC] = React.useState(0);
    const [ticketsT, setTicketsT] = React.useState(0);

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const dateRefM = useRef()
    const team1Ref = useRef()
    const team2Ref = useRef()
    const ticketPriceRefM = useRef()
    const numberOfTicketsRefM = useRef()

    const dateRef = useRef()
    const filmRef = useRef()
    const genreRef = useRef()
    const leadStudioRef = useRef()
    const yearRef = useRef()
    const ticketPriceRef = useRef()
    const numberOfTicketsRef = useRef()

    const dateRefT = useRef()
    const nameRefT = useRef()
    const placeRefT = useRef()
    const typeRefT = useRef()
    const ticketPriceRefT = useRef()
    const numberOfTicketsRefT = useRef()

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

    async function handleAddMatch(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/addmatchevent", {
            date: dateRefM.current.value,
            team_1: team1Ref.current.value,
            team_2: team2Ref.current.value,
            ticket_price: ticketPriceRefM.current.value,
            number_of_tickets: numberOfTicketsRefM.current.value
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                alertProperties(true, "error", "Error", "Forbidden Access!");
            });
    }

    async function handleAddCinema(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/addcinemaevent", {
            date: dateRef.current.value,
            film: filmRef.current.value,
            genre: genreRef.current.value,
            lead_studio: leadStudioRef.current.value,
            year: yearRef.current.value,
            ticket_price: ticketPriceRef.current.value,
            number_of_tickets: numberOfTicketsRef.current.value
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                alertProperties(true, "error", "Error", "Forbidden Access!");
            });
    }

    async function handleAddTheatre(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/addtheatreevent", {
            date: dateRefT.current.value,
            name: nameRefT.current.value,
            place: placeRefT.current.value,
            type: typeRefT.current.value,
            ticket_price: ticketPriceRefT.current.value,
            number_of_tickets: numberOfTicketsRefT.current.value
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                alertProperties(true, "error", "Error", "Forbidden Access!");
            });
    }

    function handleDeleteMatch(date, team_1, team_2, ticket_price, number_of_tickets) {
        axios.post("http://localhost:5000/deletematchevent", {
            date: date,
            team_1: team_1,
            team_2: team_2,
            ticket_price: ticket_price,
            number_of_tickets: number_of_tickets
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                alertProperties(true, "error", "Error", "Forbidden Access!");
            });
    }

    function handleDeleteMovie(date, film, genre, lead_studio, year, ticket_price, number_of_tickets) {
        axios.post("http://localhost:5000/deletecinemaevent", {
            date: date,
            film: film,
            genre: genre,
            lead_studio: lead_studio,
            year: year,
            ticket_price: ticket_price,
            number_of_tickets: number_of_tickets
        }, {
            withCredentials: true
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

    function handleDeleteTheatre(date, name, place, type, ticket_price, number_of_tickets) {
        axios.post("http://localhost:5000/deletetheatreevent", {
            date: date,
            name: name,
            place: place,
            type: type,
            ticket_price: ticket_price,
            number_of_tickets: number_of_tickets
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                alertProperties(true, "error", "Error", "Forbidden Access!");
            });
    }

    function handleAddTicketsMatch(date, team_1, team_2) {
        if (ticketsM != 0) {
            axios.post("http://localhost:5000/addmatchtickets", {
                date: date,
                team_1: team_1,
                team_2: team_2,
                surplus: ticketsM
            }, {
                withCredentials: true
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

    function handleAddTicketsCinema(date, film, genre, lead_studio, year) {
        if (ticketsC != 0) {
            axios.post("http://localhost:5000/addcinematickets", {
                date: date,
                film: film,
                genre: genre,
                lead_studio: lead_studio,
                year: year,
                surplus: ticketsC
            }, {
                withCredentials: true
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

    function handleAddTicketsTheatre(date, name, place, type) {
        if (ticketsT != 0) {
            axios.post("http://localhost:5000/addtheatretickets", {
                date: date,
                name: name,
                place: place,
                type: type,
                surplus: ticketsT
            }, {
                withCredentials: true
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
            axios.get("http://localhost:5000/getmatchevents")
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
                })
                .catch(err => {
                    console.log(err);
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
                            <Tab style={{ color: "#adbac7" }} label="Matches" value="1" />
                            <Tab style={{ color: "#adbac7" }} label="Cinema" value="2" />
                            <Tab style={{ color: "#adbac7" }} label="Theatre" value="3" />
                            <Tab style={{ color: "#adbac7" }} label="Add events" value="4" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TextField sx={{ input: { color: 'white' } }} style={{ marginBottom: "10px" }} id="outlined-basic" label="Tickets surplus" variant="outlined" onChange={handleTicketsM} />
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
                                            <TableCell align="right">
                                                <MuiButton color="inherit" style={{ backgroundColor: "#2ca460", marginRight: "10px" }} onClick={() => handleAddTicketsMatch(item.date, item.team_1, item.team_2)}><b>Add</b></MuiButton>
                                                <MuiButton color="inherit" style={{ backgroundColor: "coral" }} onClick={() => handleDeleteMatch(item.date, item.team_1, item.team_2, item.ticket_price, item.number_of_tickets)}><b>Delete</b></MuiButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                        <TextField sx={{ input: { color: 'white' } }} style={{ marginBottom: "10px" }} id="outlined-basic" label="Tickets surplus" variant="outlined" onChange={handleTicketsC} />
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
                                            <TableCell align="right">
                                                <MuiButton color="inherit" style={{ backgroundColor: "#2ca460", marginRight: "10px" }} onClick={() => handleAddTicketsCinema(item.date, item.film, item.genre, item.lead_studio, item.year)}><b>Add</b></MuiButton>
                                                <MuiButton color="inherit" style={{ backgroundColor: "coral" }} onClick={() => handleDeleteMovie(item.date, item.film, item.genre, item.lead_studio, item.year, item.ticket_price, item.number_of_tickets)}><b>Delete</b></MuiButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                        <TextField sx={{ input: { color: 'white' } }} style={{ marginBottom: "10px" }} id="outlined-basic" label="Tickets surplus" variant="outlined" onChange={handleTicketsT} />
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
                                            <TableCell align="right">
                                                <MuiButton color="inherit" style={{ backgroundColor: "#2ca460", marginRight: "10px" }} onClick={() => handleAddTicketsTheatre(item.date, item.name, item.place, item.type)}><b>Add</b></MuiButton>
                                                <MuiButton color="inherit" style={{ backgroundColor: "coral" }} onClick={() => handleDeleteTheatre(item.date, item.name, item.place, item.type, item.ticket_price, item.number_of_tickets)}><b>Delete</b></MuiButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value="4">
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: "10px" }}>
                                <Form style={{ color: "#adbac7" }} onSubmit={handleAddMatch}>
                                    <Form.Group id="date_m">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control ref={dateRefM} required />
                                    </Form.Group>
                                    <Form.Group id="team_1">
                                        <Form.Label>Team 1</Form.Label>
                                        <Form.Control ref={team1Ref} required />
                                    </Form.Group>
                                    <Form.Group id="team_2">
                                        <Form.Label>Team 2</Form.Label>
                                        <Form.Control ref={team2Ref} required />
                                    </Form.Group>
                                    <Form.Group id="ticket_price_m">
                                        <Form.Label>Ticket price</Form.Label>
                                        <Form.Control type="number" ref={ticketPriceRefM} required />
                                    </Form.Group>
                                    <Form.Group id="number_of_tickets_m">
                                        <Form.Label>Number of tickets</Form.Label>
                                        <Form.Control type="number" ref={numberOfTicketsRefM} required />
                                    </Form.Group>
                                    <br></br>
                                    <Button disabled={loading} className="w-100" type="submit">
                                        Add match event
                                    </Button>
                                </Form>
                            </div>
                            <div style={{ marginRight: "10px" }}>
                                <Form style={{ color: "#adbac7" }} onSubmit={handleAddCinema}>
                                    <Form.Group id="date_c">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control ref={dateRef} required />
                                    </Form.Group>
                                    <Form.Group id="film">
                                        <Form.Label>Film</Form.Label>
                                        <Form.Control ref={filmRef} required />
                                    </Form.Group>
                                    <Form.Group id="genre">
                                        <Form.Label>Genre</Form.Label>
                                        <Form.Control ref={genreRef} required />
                                    </Form.Group>
                                    <Form.Group id="lead_studio">
                                        <Form.Label>Lead studio</Form.Label>
                                        <Form.Control ref={leadStudioRef} required />
                                    </Form.Group>
                                    <Form.Group id="year">
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control type="number" ref={yearRef} required />
                                    </Form.Group>
                                    <Form.Group id="ticket_price_c">
                                        <Form.Label>Ticket price</Form.Label>
                                        <Form.Control type="number" ref={ticketPriceRef} required />
                                    </Form.Group>
                                    <Form.Group id="number_of_tickets_c">
                                        <Form.Label>Number of tickets</Form.Label>
                                        <Form.Control type="number" ref={numberOfTicketsRef} required />
                                    </Form.Group>
                                    <br></br>
                                    <Button disabled={loading} className="w-100" type="submit">
                                        Add cinema event
                                    </Button>
                                </Form>
                            </div>
                            <div>
                                <Form style={{ color: "#adbac7" }} onSubmit={handleAddTheatre}>
                                    <Form.Group id="date_t">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control ref={dateRefT} required />
                                    </Form.Group>
                                    <Form.Group id="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control ref={nameRefT} required />
                                    </Form.Group>
                                    <Form.Group id="place">
                                        <Form.Label>Place</Form.Label>
                                        <Form.Control ref={placeRefT} required />
                                    </Form.Group>
                                    <Form.Group id="type">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control ref={typeRefT} required />
                                    </Form.Group>
                                    <Form.Group id="ticket_price_t">
                                        <Form.Label>Ticket price</Form.Label>
                                        <Form.Control type="number" ref={ticketPriceRefT} required />
                                    </Form.Group>
                                    <Form.Group id="number_of_tickets_t">
                                        <Form.Label>Number of tickets</Form.Label>
                                        <Form.Control type="number" ref={numberOfTicketsRefT} required />
                                    </Form.Group>
                                    <br></br>
                                    <Button disabled={loading} className="w-100" type="submit">
                                        Add theatre event
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

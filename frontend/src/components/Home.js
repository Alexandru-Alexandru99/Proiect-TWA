import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom"

import IconHome from "../images/red-carpet.png"

export default function Home() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: "#22272e" }}>
                    <Toolbar>
                        <Typography style={{ color: "#adbac7" }} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            EventsNOC
                        </Typography>
                        <Button color="inherit" ><Link style={{ color: "#adbac7" }} to="/signup">Sign Up</Link></Button>
                        <Button color="inherit"><Link style={{ color: "#adbac7" }} to="/login">Login</Link></Button>
                        <Button color="inherit"><Link style={{ color: "#adbac7" }} to="/forgot-password">Forgot Password</Link></Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <img style={{ paddingTop: "18%", paddingLeft: "45%" }} src={IconHome} alt="IconHome" />
        </>
    );
}

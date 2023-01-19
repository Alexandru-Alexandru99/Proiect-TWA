import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

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
                localStorage.setItem("email", emailRef.current.value)
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <div style={{ paddingRight: "10%", paddingLeft: "10%", paddingTop: "10%", paddingBottom: "10%" }}>

                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
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
                                <Form.Label>Firstname</Form.Label>
                                <Form.Control type="text" ref={firstNameRef} required />
                            </Form.Group>
                            <Form.Group id="lastname">
                                <Form.Label>Lastname</Form.Label>
                                <Form.Control type="text" ref={lastNameRef} required />
                            </Form.Group>
                            <br></br>
                            <Button disabled={loading} className="w-100" type="submit">
                                Sign Up
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div style={{color:"#adbac7"}} className="w-100 text-center mt-2">
                    Already have an account? <Link style={{color:"#adbac7"}} to="/login">Log In</Link>
                </div>
                <div className="w-100 text-center mt-2">
                    <Link style={{color:"#adbac7"}} to="/">Home</Link>
                </div>
            </div>
        </>
    )
}
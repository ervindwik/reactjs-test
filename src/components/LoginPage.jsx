import {useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "../Styles/Login.css";
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [state, setState] = useState(false);
    const navigate = useNavigate();

    const usernameField = useRef("");
    const passwordField = useRef("");

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            const userToLoginPayload = {
                username: usernameField.current.value,
                password: passwordField.current.value,
            };

            const loginRequest = await axios.post(
                "http://localhost:4000/v1/auth/login",
                userToLoginPayload
            );

            const loginResponse = loginRequest.data;

            if (loginResponse.status) {
                localStorage.setItem("token", loginResponse.data.token);

                navigate("/job-list");
            }
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };


    const handleBtnPass = () => {
        setState(prevState => !prevState);
    }


    return (
        <>
            <Container>
                <Row className="d-flex justify-content-center align-items-center h-100">
                    <Col md="5">
                        <div className="d-flex justify-content-center login-body">
                            <Form onSubmit={onLogin}>
                                <h3>Login</h3>
                                <Form.Group className="mb-3" controlId="formInputUsername">
                                    <Form.Control
                                        type="text"
                                        className="mail Input text-black"
                                        placeholder="Username..."
                                        ref={usernameField}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formInputPass">
                                    <Row>
                                        <Col className="md-10">
                                            <Form.Control
                                                type={state ? "text" : "password"}
                                                className="password text-black"
                                                placeholder="Password..."
                                                ref={passwordField}
                                            />
                                        </Col>
                                        <Col className="md-2">
                                            <Button id="btn-pass" onClick={handleBtnPass}>
                                                {
                                                    state ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formCheckbox">
                                    <Row>
                                        <Col>
                                            <Form.Check type="checkbox" label="Remember me" />
                                        </Col>
                                        <Col>
                                            <Link className="lupa-pass">Forgot Password ?</Link>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Button id="button-masuk" type="submit">
                                    Login
                                </Button>
                                {errorResponse.isError && (
                                    <Alert variant="danger">{errorResponse.message}</Alert>
                                )}

                            </Form>
                        </div>
                        <div className="side-cancel">
                            <button className="btn-cancel">
                                <Link id="cancel" to="/" ><AiOutlineClose /></Link>
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container >
        </>
    );
};

export default Login;

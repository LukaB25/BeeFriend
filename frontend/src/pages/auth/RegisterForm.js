import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import styles from '../../styles/LoginRegisterForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.css';

import { Form, Button, Col, Row, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const RegisterForm = () => {
    const [registerData, setRegisterData] = useState({
        username: '',
        password1: '',
        password2: ''
    });
    const { username, password1, password2 } = registerData;

    const [errors, setErrors] = useState({});

    const history = useHistory()

    const handleChange = (event) => {
        setRegisterData({
            ...registerData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await axios.post('dj-rest-auth/registration/', registerData)
            history.push('/login')
        } catch (err) {
            setErrors(err.response?.data)
        }
    }
    
  return (
    <Container className={styles.FormContainer}>
        <Row className="justify-content-center">
            <Col className={`${styles.FormCol} text-center`} sm={12} md={8} lg={6}>
                <Container className={`d-flex justify-content-around ${styles.FormLinks}`}>
                    <NavLink
                        exact to="/login"
                        className={`${styles.FormSelector} ${styles.FormLogin}`}
                        activeClassName={styles.FormSelectorActive}>
                        Log In
                    </NavLink>
                    <NavLink
                        exact to="/register"
                        className={`${styles.FormSelector}`}
                        activeClassName={styles.FormSelectorActive}>
                        Register
                    </NavLink>
                </Container>
                <Container className={styles.FormMessage}>
                    <p><i class="fas fa-arrow-up"></i> Already have an account? Log in instead.</p>
                </Container>
                <Container className={appStyles.Content}>
                    <h1 className={styles.Header}>Register</h1>
                    <Form
                        className={styles.Form}
                        onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Username"
                                className={`mx-auto ${styles.Input}`}
                                name="username"
                                value={username}
                                onChange={handleChange} />
                        </Form.Group>
                        {errors.username?.map((message, idx) =>
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        )}

                        <Form.Group controlId="password1">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className={`mx-auto ${styles.Input}`}
                                name="password1"
                                value={password1}
                                onChange={handleChange} />
                        </Form.Group>
                        {errors.password1?.map((message, idx) =>
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        )}

                        <Form.Group controlId="password2">
                            <Form.Label className="d-none">Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                className={`mx-auto ${styles.Input}`}
                                name="password2"
                                value={password2}
                                onChange={handleChange} />
                        </Form.Group>
                        {errors.password2?.map((message, idx) =>
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        )}
                        {errors.non_field_errors?.map((message, idx) =>
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        )}
                        <Button
                            className={`${btnStyles.FormButton} ${btnStyles.Button} ${btnStyles.ButtonWide}`}
                            type="submit">
                            Register
                        </Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    </Container>
  )
}

export default RegisterForm
import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../../styles/LoginRegisterForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';

const LoginForm = () => {
  const setCurrentUser = useSetCurrentUser();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = loginData;

  const [errors, setErrors] = useState({});

  const history = useHistory()

  const handleChange = (event) => {
      setLoginData({
          ...loginData,
          [event.target.name]: event.target.value,
      })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
      try{
        const {data} = await axios.post('dj-rest-auth/login/', loginData)
        setCurrentUser(data.user)
        toast.success(`Logged in successfully! Welcome, ${data.user.username}!`);
        setTimeout(() => {
            history.push('/')
        }, 2500)
      } catch (err) {
        setErrors(err.response?.data)
        toast.error('Failed to log in. Please check your credentials.')
      }
  }

  return (
    <Container>
        <Row className="justify-content-center">
            <Col className={`${styles.FormContainer} text-center`} sm={12} md={8} lg={6}>
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
                    <p>Don't have an account? Register for one instead. <i class="fas fa-arrow-up"></i></p>
                </Container>
                <Container className={appStyles.Content}>
                    <h1 className={styles.Header}>Log In</h1>
                    <Form
                        className={styles.Form}
                        onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                className={`mx-auto ${styles.Input}`}
                                name="username"
                                value={username}
                                onChange={handleChange} />
                        </Form.Group>
                        {errors.username?.map((message, idx) =>(
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        ))}

                        <Form.Group controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className={`mx-auto ${styles.Input}`}
                                name="password"
                                value={password}
                                onChange={handleChange} />
                        </Form.Group>
                        {errors.password?.map((message, idx) =>(
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        ))}

                        {errors.non_field_errors?.map((message, idx) =>(
                            <Alert variant="warning"
                                className={`${styles.Alert} mx-auto`}
                                key={idx}>{message}</Alert>
                        ))}
                        <ToastContainer
                            position="top-right"
                            autoClose={2500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                            className="ToastMessage"
                        />
                        <Button
                            className={`${btnStyles.FormButton} ${btnStyles.Button} ${btnStyles.ButtonWide}`}
                            type="submit">
                            Log In
                        </Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    </Container>
  )
}

export default LoginForm
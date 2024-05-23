import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import styles from "../../styles/PostCreateEditForm.module.css";
import profileStyles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { toast } from "react-toastify";

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // redirect user if they are not the owner of this profile
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      history.goBack();
    } catch (err) {
      toast.error("Error updating password");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className="justify-content-center text-center">
      <Col className={`${appStyles.Content} text-center`} sm={12} md={8} lg={6}>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className={profileStyles.UpdateProfileInfo}>New password</Form.Label>
              <Form.Control
                placeholder="new password"
                className={`${styles.TextAreaWide} ${styles.Input} `}
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
            </Form.Group>
            {errors?.new_password1?.map((message, idx) => (
              <Alert variant="warning"
                className={`${styles.Alert} mx-auto`}
                key={idx}>{message}</Alert>
            ))}
            <Form.Group className={profileStyles.UpdateProfileInfo}>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                className={`${styles.TextAreaWide} ${styles.Input} `}
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
            </Form.Group>
            {errors?.new_password2?.map((message, idx) => (
              <Alert variant="warning"
              className={`${styles.Alert} mx-auto`}
              key={idx}>{message}</Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;
import React, { useRef, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRedirect } from '../../hooks/useRedirect';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Image } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

import styles from '../../styles/PostCreateEditForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import assetStyles from '../../styles/Asset.module.css';

import Upload from '../../assets/upload.png';
import Asset from '../../components/Asset';




const PostCreateForm = () => {
  // PostCreateForm component used to render a form to create a new post 
  // handles new post submission and redirects user to the new post page on successful post creation
  // redirect to home page if user is not logged in
  useRedirect('loggedOut');
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    })
  }

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0])
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    if (imageInput.current.files.length > 0) {
      formData.append('image', imageInput.current.files[0]);
    }
    try {
      const { data } = await axiosReq.post('/posts/', formData);
      toast.success('Post created successfully!');
      setTimeout(() => {
        history.push(`/posts/${data.id}`);
      }, 2500);
    } catch (err) {
      if (err.response?.data !== 401) {
        setErrors(err.response?.data);
      }
      toast.error('Failed to create post!');
    }
  }


  return (
    <Form onSubmit={handleSubmit}>
      <Row className="justify-content-center">
        <Col className={`${styles.PostFormBody} text-center`} sm={12} md={8} lg={6}>
          <Form.Group className="text-center">
            {image ? (
              <>
                <figure>
                  <Image className={assetStyles.Image} src={image} rounded />
                </figure>
                <div>
                  <Form.Label
                    className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.ButtonWide} btn`}
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Form.Label>
                </div>
              </>
            ) : (
              <Form.Label
                htmlFor="image-upload" className={styles.FormUpload}>
                <Asset src={Upload} message="Click or tap to upload an image" />
              </Form.Label>
            )}
            <Form.File
              id="image-upload"
              className="d-none"
              accept='image/*'
              onChange={handleChangeImage}
              ref={imageInput}
            />
          </Form.Group>
          {errors.image?.map((message, idx) => (
            <Alert variant="warning"
              className={`${styles.Alert} mx-auto`}
              key={idx}>{message}</Alert>
          ))}
          <Form.Group>
            <Form.Label className="d-none">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              className={`mx-auto ${styles.Input}`}
              value={title}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.title?.map((message, idx) => (
            <Alert variant="warning"
              className={`${styles.Alert} mx-auto`}
              key={idx}>{message}</Alert>
          ))}
          <Form.Group>
            <Form.Label className="d-none">Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              name="content"
              placeholder="Content"
              className={`mx-auto ${styles.Input} ${styles.TextArea}`}
              value={content}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.content?.map((message, idx) => (
            <Alert variant="warning"
              className={`${styles.Alert} mx-auto`}
              key={idx}>{message}</Alert>
          ))}
          {errors.non_field_errors?.map((message, idx) => (
            <Alert variant="warning"
              className={`${styles.Alert} mx-auto`}
              key={idx}>{message}</Alert>
          ))}
          <Container className="d-flex justify-content-center pb-5">
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
              style={{ marginTop: '7.5rem' }}
            />
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => history.goBack()}>
              <i className="fas fa-arrow-alt-circle-left"> Cancel</i>
            </Button>
            <Button
              className={`${btnStyles.PostButton} ${btnStyles.Button}`}
              type="submit">
              Post <i className="fas fa-paper-plane"></i>
            </Button>
          </Container>
        </Col>
      </Row>
    </Form>
  )
}

export default PostCreateForm

import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';

import styles from '../../styles/LoginRegisterForm.module.css';
// import styles from '../../styles/PostCreateForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import assetStyles from '../../styles/Asset.module.css';
import appStyles from '../../App.css';

import Upload from '../../assets/upload.png';
import Asset from '../../components/Asset';

const PostCreateForm = () => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const { title, content, image } = postData;

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


  return (
    <Form>
      <Row className="justify-content-center">
        <Col className={`${styles.FormContainer} text-center`} sm={12} md={8} lg={6}>
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
                htmlFor="image-upload">
                  <Asset src={Upload} message="Click or tap to upload an image" />
              </Form.Label>
            )}
            <Form.File
              id="image-upload"
              className="d-none"
              accept='image/*'
              onChange={handleChangeImage} />
          </Form.Group>
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
          <Form.Group>
            <Form.Label className="d-none">Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="content"
              placeholder="Content"
              className={`mx-auto ${styles.Input} ${styles.TextArea}`}
              value={content}
              onChange={handleChange}
            />
          </Form.Group>
          <Container className="d-flex justify-content-center pb-5">
            <Button
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
              onClick={() => {}}>
              cancel
            </Button>
            <Button
              className={`${btnStyles.FormButton} ${btnStyles.Button}`}
              type="submit">
              Post
            </Button>
          </Container>
        </Col>
      </Row>
    </Form>
  )
}

export default PostCreateForm

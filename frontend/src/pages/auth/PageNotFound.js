import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import styles from '../../styles/PageNotFound.module.css';


import NotFound from '../../assets/404_Not_Found.jpg'

const PageNotFound = () => {
  return (
    <Row className="justify-content-center text-center ">
      <Col sm={12} md={8} lg={6} className={`  ${styles.PageNotFound}`}>
        <Image src={NotFound} alt="Page not found" className={styles.Image} />
        <h1>Page Not Found</h1>
      </Col>
    </Row>
  )
}

export default PageNotFound

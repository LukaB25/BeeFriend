import React from 'react';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/PageNotFound.module.css';

const PageNotFound = () => {
  return (
    <Container className={`justify-centent-center align-items-center text-center ${styles.PageNotFound}`}>
      <p>Page Not Found</p>
    </Container>
  )
}

export default PageNotFound

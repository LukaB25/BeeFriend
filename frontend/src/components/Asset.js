import React from 'react';

import Spinner from 'react-bootstrap/Spinner';

import styles from '../styles/Asset.module.css';

const Asset = ({ spinner, src, message }) => {
  // Asset component used to display spinner, image & message
  return (
    <div className={styles.Asset}>
      {spinner && <Spinner animation="border" variant="primary" />}
      {src && <img src={src} alt={message} />}
      {message && <p>{message}</p>}
    </div>
  )
}

export default Asset

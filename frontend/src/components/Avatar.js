import React from 'react';

import styles from '../styles/Avatar.module.css';

const Avatar = ({src, height=50, width=55, text}) => {
  // Avatar component used to display user's profile image with text
  return (
    <span className={styles.HexBorder}>
      <img className={styles.Avatar} src={src}
        height={height} width={width} alt="avatar" />
        {text}
    </span>
  )
}

export default Avatar

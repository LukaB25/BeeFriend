import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';

const Profile = ({ profile, mobile }) => {
  const { id, friend_id, owner, image } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser.username === owner;
  return (
    <div className={`d-flex align-items-center ${mobile && "flex-column"}`}>
      <div>
        <Link to={`/profiles/${id}`} className={`${styles.ProfileLink} d-flex align-items-center`}>
          <Avatar src={image} height={50} width={55} />
        </Link>
      </div>
      <div className={`${styles.WordBreak} ${styles.Username} mx-2`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile && currentUser && !is_owner && (
          friend_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => {}}
            >Unfriend</Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
              onClick={() => {}}
            >BeFriend</Button>
          )
        )}
      </div>
    </div>
  )
}

export default Profile

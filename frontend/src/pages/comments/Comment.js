import React from 'react';
import { Link } from 'react-router-dom';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/Comment.module.css';
import Avatar from '../../components/Avatar';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    body,
    updated_at,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  return (
    <>
      <hr />
      <Media className={styles.Comment}>
        <Link to={`/profiles/${profile_id}`} className="mt-3">
          <Avatar src={profile_image} height={30} width={35} />
        </Link>
        <Media.Body>
          <Container className="d-flex justify-content-between">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at} <i class="fas fa-calendar-alt"></i></span>
          </Container>
          <p className={`${styles.CommentBody} text-justify`}>{body}</p>
        </Media.Body>
        {is_owner && (
            <MoreDropdown handleEdit={() => {}} handleDelete={() => {}}/>
        )}
      </Media>
    </>
  )
}

export default Comment

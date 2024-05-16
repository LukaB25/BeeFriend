import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';
import useFriendRequestAction from '../../hooks/useFriendRequestAction';

const Profile = ({ profile, mobile }) => {
  const { id, friend_id, owner, image } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const {
    sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleDenyFriendRequest,
  } = useFriendRequestAction();
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
            <>
    {currentUser && !is_owner ? (
      <>
        {sentFriendRequests?.results?.map(request => (
          (request?.owner_profile_id === currentUser?.profile_id && request?.friend === profile?.id) ? (
            <Button
                  className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
                  onClick={() => handleDenyFriendRequest(request?.id)}
                >
                  Cancel
                </Button>
          ) : null
        ))}
        {receivedFriendRequests?.results?.map(request => (
          (request?.owner_profile_id === profile?.id || request?.friend === profile?.id) &&
          (request?.owner_profile_id !== currentUser?.id || request?.friend !== currentUser?.id) ? (
            <>
            <small>Respond to friend request</small>
            <div className="d-inline-flex justify-content-around">
              <Button
                className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.HexButton}`}
                onClick={() => handleAcceptFriendRequest(request?.id)}
              >
                <i className="fas fa-check"></i>
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.CancelButton} ${btnStyles.HexButton}`}
                onClick={() => handleDenyFriendRequest(request?.id)}
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
            </>
          ) : null
        ))}
        {acceptedFriendRequests?.results?.map(request => (
          request?.owner_profile_id === profile?.id || request?.friend === profile?.id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => handleDenyFriendRequest(request?.id)}
            >
              Unfriend
            </Button>
        ) : (
          (!sentFriendRequests?.results?.some(request => request?.friend === profile?.id ) &&
           !receivedFriendRequests?.results?.some(request => request?.owner_profile_id === profile?.id )) &&
            <Button
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
              onClick={() => handleSendFriendRequest(profile?.id)}
            >
              BeFriend
            </Button>
          )
        ))}
      </>
    ) : null
  }
  </>
          )
        )}
      </div>
    </div>
  )
}

export default Profile

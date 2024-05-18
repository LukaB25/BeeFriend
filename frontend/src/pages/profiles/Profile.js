import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';
import Asset from '../../components/Asset';
import useFriendRequestAction from '../../hooks/useFriendRequestAction';

const Profile = ({ profile, mobile }) => {
  const { id, friend_id, owner, image } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const [hasLoaded, setHasLoaded] = useState(false);

  const {
    sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleDenyFriendRequest,
  } = useFriendRequestAction();

  useEffect(() => {
    if (sentFriendRequests &&
      receivedFriendRequests &&
      acceptedFriendRequests) {
      setHasLoaded(true);
    } else {
      setHasLoaded(false);
    }
  }, [sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    currentUser]);

  if (!hasLoaded) {
    return <Asset spinner />;
  }
  
  return (
    <div className={`d-flex align-items-center ${mobile && "flex-column"}`}>
      <div>
        <Link to={`/profiles/${id}`} className={`${styles.ProfileLink} d-flex align-items-center`}>
          <Avatar key={`${owner}-${profile?.id}`} src={image} height={50} width={55} />
        </Link>
      </div>
      <div className={`${styles.WordBreak} ${styles.Username} mx-2`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile && currentUser && !is_owner && (
          friend_id ? (
            <Button
              key={friend_id}
              className={`${btnStyles.Button} ${btnStyles.UnfriendButton}`}
              onClick={() => handleDenyFriendRequest(friend_id)}
            >Unfriend</Button>
          ) : (
            <>
              {currentUser && !is_owner ? (
                <>
                  {sentFriendRequests?.results?.map(request => (
                    (request?.owner_profile_id === currentUser?.profile_id && request?.friend === profile?.id) ? (
                      <Button
                      key={request.id}
                        className={`${btnStyles.Button} ${btnStyles.UnfriendButton}`}
                        onClick={() => handleDenyFriendRequest(request?.id)}
                      >
                        Cancel
                      </Button>
                    ) : null
                  ))}
                  {receivedFriendRequests?.results?.map(request => (
                    (request?.owner_profile_id === profile?.id || request?.friend === profile?.id) &&
                      (request?.owner_profile_id !== currentUser?.id || request?.friend !== currentUser?.id) ? (
                      <React.Fragment key={request.id}>
                        <div className="d-flex justify-content-around text-center align-self-center">
                          <Button
                            key={request.id}
                            className={`${btnStyles.Button} ${btnStyles.FriendButton} ${btnStyles.HexButton}`}
                            onClick={() => handleAcceptFriendRequest(request?.id)}
                          >
                            <i className="fas fa-check"></i>
                          </Button>
                          <Button
                            key={`${request.id}-1`}
                            className={`${btnStyles.Button} ${btnStyles.UnfriendButton} ${btnStyles.HexButton}`}
                            onClick={() => handleDenyFriendRequest(request?.id)}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </div>
                      </React.Fragment>
                    ) : null
                  ))}
                  {acceptedFriendRequests?.results?.map(request => {
                    const isCurrentUserFriend = (request.friend === currentUser?.profile_id || request.owner_profile_id === currentUser?.profile_id);
                    const isProfileFriend = (request.friend === profile?.id || request.owner_profile_id === profile?.id);
                    const isNotInSentRequests = !sentFriendRequests?.results?.some(request => request.friend === profile?.id);
                    const isNotInReceivedRequests = !receivedFriendRequests?.results?.some(request => request.owner_profile_id === profile?.id);

                    return isProfileFriend && isCurrentUserFriend && isNotInSentRequests && isNotInReceivedRequests ? (
                      <Button
                        key={request.id}
                        className={`${btnStyles.Button} ${btnStyles.UnfriendButton}`}
                        onClick={() => handleDenyFriendRequest(request.id)}
                      >
                        Unfriend
                      </Button>
                    ) : null
                  })}
                  {
                    !(
                      sentFriendRequests?.results?.some(request => request.friend === profile?.id && request.owner_profile_id === currentUser?.profile_id) ||
                      receivedFriendRequests?.results?.some(request => request.owner_profile_id === profile?.id && request.friend === currentUser?.profile_id) ||
                      acceptedFriendRequests?.results?.some(request =>
                        (request.friend === profile?.id && request.owner_profile_id === currentUser?.profile_id) ||
                        (request.owner_profile_id === profile?.id && request.friend === currentUser?.profile_id)
                      )
                    ) ? (
                      <Button
                        key={profile?.id}
                        className={`${btnStyles.Button} ${btnStyles.FriendButton}`}
                        onClick={() => handleSendFriendRequest(profile?.id)}
                      >
                        BeFriend
                      </Button>
                    ) : null
                  }
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

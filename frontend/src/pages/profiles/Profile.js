import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import useFriendRequestAction from '../../hooks/useFriendRequestAction';

import Button from 'react-bootstrap/Button';

import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';

import Avatar from '../../components/Avatar';
import Asset from '../../components/Asset';

const Profile = ({ profile, mobile }) => {
  // Profile component used to display a user's profile image and username
  // displays a button to send a friend request if the user is not the owner of the profile
  // displays a button to unfriend if the user is friends with the profile owner
  // displays a button to cancel friend request if the user has sent a friend request to the profile owner
  // displays a button to accept or deny friend request if the user has received a friend request from the profile owner
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
                        BeeFriend
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

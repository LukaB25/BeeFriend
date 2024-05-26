import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { useProfileData } from '../contexts/ProfileDataContext';
import useFriendRequestAction from '../hooks/useFriendRequestAction';

import Button from 'react-bootstrap/Button';

import btnStyles from '../styles/Button.module.css';

import Asset from './Asset';

const FriendButtons = () => {
  const currentUser = useCurrentUser();

  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

  const is_owner = currentUser?.username === profile?.owner;

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
    acceptedFriendRequests]);

  if (!hasLoaded) {
    return <Asset spinner />;
  }
  return (
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
              <>
                <small>Respond to friend request</small>
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
              </>
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
  );
}

export default FriendButtons;
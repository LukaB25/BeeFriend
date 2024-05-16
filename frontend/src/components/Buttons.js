import React from 'react';

import Button from 'react-bootstrap/Button';

import btnStyles from '../styles/Button.module.css';

import { useCurrentUser } from '../contexts/CurrentUserContext';

import useFriendRequestAction from '../hooks/useFriendRequestAction';
import { useProfileData } from '../contexts/ProfileDataContext';


const FriendButtons = () => {
  const currentUser = useCurrentUser();

  const {pageProfile} = useProfileData();
  const [profile] = pageProfile.results;

  const is_owner = currentUser?.username === profile?.owner;

  const {
    sentFriendRequests,
    receivedFriendRequests,
    acceptedFriendRequests,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleDenyFriendRequest,
  } = useFriendRequestAction();

  return (
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
);
}

export default FriendButtons;
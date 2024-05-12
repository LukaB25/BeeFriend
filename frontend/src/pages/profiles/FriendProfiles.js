import React, { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'

import styles from '../../styles/PostsPage.module.css'
import appStyles from '../../App.module.css'

import Asset from '../../components/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useFriendData, useSetFriendData } from '../../contexts/FriendDataContext';

const FriendProfiles = ({ mobile }) => {
  const { friends } = useFriendData();
  const [hasLoaded, setHasLoaded] = useState(false);
  const setFriendsData = useSetFriendData();
  const currentUser = useCurrentUser();


  useEffect(() => {
    const timer = setTimeout (() => {
      setHasLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentUser, setFriendsData])
  
  return (
    <Container
      className={`${appStyles.Content} ${styles.SmallComponent}
        ${!mobile && styles.LargeScreen} ${mobile && styles.SmallScreen}
        ${mobile && "d-lg-none"} text-center`}>
      <h4>Friends</h4>
      {hasLoaded ? (
        friends.length ? (
          <>
            {mobile ? (
              <div className="d-flex justify-content-around">
                {friends.slice(0, 3).map((friend) => (
                  <p key={friend.id}>{friend.owner}</p>
                ))}
              </div>
            ) : (
              friends.map((friend) => (
                <p key={friend.id}>{friend.owner}</p>
              ))
            )}
          </>
        ) : currentUser ? (
          <p>You haven't made any friends... yet.</p>
        ) : (
          <p>Log in to see your friends!</p>
        )
      ) : (
        <Asset spinner className="text-center" />
      )}
    </Container>

  )
}

export default FriendProfiles

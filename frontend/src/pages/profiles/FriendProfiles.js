import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';

import { Container } from 'react-bootstrap'

import styles from '../../styles/PostsPage.module.css'
import appStyles from '../../App.module.css'

import Asset from '../../components/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const FriendProfiles = ({ mobile }) => {
  const [friendsData, setFriendsData] = useState ({
    friends: { results: [] },
  });
  const { friends } = friendsData;
  const currentUser = useCurrentUser();

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout (() => {
      setFriendsData({ results : [] });
      setHasLoaded(true);
    }, 2000);
    const fetchFriends = async () => {
      try {
        const { data } = await axiosReq.get('/friends/user/');
        setFriendsData({
          friends: data
        })
      } catch (err) {
        console.log(err)
      } finally {
        clearTimeout(timer);
        setHasLoaded(true);
      }
    }

    fetchFriends();
    return () => clearTimeout(timer);
  }, [currentUser])
  return (
    <Container
      className={`${appStyles.Content} ${styles.SmallComponent}
        ${!mobile && styles.LargeScreen} ${mobile && "d-lg-none"}
        text-center`}>
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
        ) : (
          <p>You haven't made any friends... yet.</p>
        )
      ) : (
        <Asset spinner className="text-center" />
      )}
    </Container>

  )
}

export default FriendProfiles

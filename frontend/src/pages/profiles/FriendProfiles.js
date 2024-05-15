import React, { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'

import styles from '../../styles/PostsPage.module.css'
import appStyles from '../../App.module.css'

import noResults from '../../assets/no_results.png';
import Asset from '../../components/Asset';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useFriendData, useSetFriendData } from '../../contexts/FriendDataContext';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { fetchMoreData } from '../../utils/utils';

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
              // <InfiniteScroll
              //   children={
              //       friends.map((friend) => (
              //     <p key={friend.id}>{friend.owner}</p>
              //   ))
              //   }
              //   dataLength={friends.results.length}
              //   loader={<Asset spinner />}
              //   hasMore={!!friends.next}
              //   next={() => fetchMoreData(friends, setFriendsData)}
              // />
              friends.map((friend) => (
                <p key={friend.id}>{friend.owner}</p>
              ))
            )}
          </>
        ) : currentUser ? (
          <Asset src={noResults} message="You haven't made any friends... yet." />
        ) : (
        <Asset src={noResults} message="Log in to see your friends!" />
        )
      ) : (
        <Asset spinner className="text-center" />
      )}
    </Container>

  )
}

export default FriendProfiles

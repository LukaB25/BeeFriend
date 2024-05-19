import React, { useEffect, useState } from 'react';

import { Container } from 'react-bootstrap';

import styles from '../../styles/PostsPage.module.css';
import appStyles from '../../App.module.css';

import noResults from '../../assets/no_results.png';
import Asset from '../../components/Asset';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSetFriendData } from '../../contexts/FriendDataContext';
import { useFriendRequestData } from '../../contexts/FriendRequestContext';
import Profile from './Profile';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { fetchMoreData } from '../../utils/utils';

const FriendProfiles = ({ mobile }) => {
  const { acceptedFriendRequests } = useFriendRequestData();
  const [hasLoaded, setHasLoaded] = useState(false);
  const setFriendsData = useSetFriendData();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const timer = setTimeout (() => {
      setHasLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, setFriendsData])

  const friendProfiles = acceptedFriendRequests?.results?.filter((request) => (
    request?.friend === currentUser?.profile_id ||
    request?.owner_profile_id === currentUser?.profile_id
  )).map((request) => (
      request.friend === currentUser?.profile_id ? (
        <Profile  key={request.id}
        profile={{
          id: request.owner_profile_id,
          friend_id: request.id,
          owner: request.owner,
          image: request.owner_profile_image
        }} />
      ) : (
        <Profile key={request.id}
        profile={{
          id: request.friend,
          friend_id: request.id,
          owner: request.friend_username,
          image: request.friend_profile_image
        }} />
      )
  ));
  
  
  return (
    <Container
      className={`${appStyles.Content} ${styles.SmallComponent}
        ${!mobile && styles.LargeScreen} ${mobile && styles.SmallScreen}
        ${mobile && "d-lg-none"} text-center`}>
      <h4>Friends</h4>
      {hasLoaded ? (
        currentUser && acceptedFriendRequests ? (
          <>
            {mobile ? (
              <div className="d-flex justify-content-around">
                {acceptedFriendRequests?.results?.filter((request) => (
                  request?.friend === currentUser?.profile_id ||
                  request?.owner_profile_id === currentUser?.profile_id
                )).slice(0, 2).map((request) => (
                  request?.profile_id !== currentUser?.profile_id ? (
                    <Profile key={request.id}
                      profile={{
                        id: request.owner_profile_id,
                        friend_id: request.id,
                        owner: request.owner,
                        image: request.owner_profile_image
                      }} mobile />
                  ) : (
                    <Profile key={request.id}
                      profile={{
                        id: request.friend,
                        friend_id: request.id,
                        owner: request.friend_username,
                        image: request.friend_profile_image
                      }} mobile />
                  )
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
              friendProfiles
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

import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import styles from '../../styles/ProfilePage.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';

import Asset from '../../components/Asset';
import noResults from '../../assets/no_results.png';
import { fetchMoreData } from '../../utils/utils';

import RecommendedProfiles from './RecommendedProfiles';
import FriendProfiles from './FriendProfiles';
import Post from '../posts/Post';

import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';




function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setProfileData = useSetProfileData();
  const {pageProfile} = useProfileData();
  const [profile] = pageProfile.results;

  const [profilePosts, setProfilePosts] = useState({ results: [] });
  
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{data: pageProfile}, {data: profilePosts}] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/posts/?owner__profile=${id}`),
        ]);
        setProfileData(prevState => ({
          ...prevState,
          pageProfile: {results: [pageProfile]},
        }))
        setProfilePosts(profilePosts);
        console.log(profilePosts)
        setHasLoaded(true);
      } catch(err) {
        console.log(err)
      }
    }

    fetchData();
  }, [id, setProfileData]);
  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image src={profile?.image} alt="Profile image" className={styles.ProfileImage} />
        </Col>
        <Col lg={6}>
          <h3 className={`${styles.Username} mt-2`}>{profile?.owner}'s profile</h3>
          <Row className="justify-content-between no-gutters">
            <Col xs={4} className={`${styles.ProfileStats}`}>
              <div>
                Posts
              </div>
              <div>
                {profile?.post_count}
              </div>
            </Col>
            <Col xs={4} className={styles.ProfileStats}>
              <div>
                Interactions
              </div>
              <div>
                {profile?.post_interaction_count}
              </div>
            </Col>
            <Col xs={4} className={styles.ProfileStats}>
              <div>
                Friends
              </div>
              <div>
                {profile?.friend_count}
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
        {currentUser && !is_owner && (
          profile?.friend_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => {}}
            >Unfriend</Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
              onClick={() => {}}
            >BeFriend</Button>
          )
        )}
        </Col>
        { profile?.content && <Col className="p-3">{profile?.content}</Col> }
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
    </>
  );
  

  return (
    <Row className="h-100 justify-content-center">
      <Col lg={3} className="d-none d-lg-block">
        <RecommendedProfiles />
        <FriendProfiles />
      </Col>
      <Col className="justify-content-center text-center" sm={12} md={8} lg={6}>
        <Row className="justify-content-center">
          <Col xs={6}>
            <RecommendedProfiles mobile />
          </Col>
          <Col xs={6}>
            <FriendProfiles mobile />
          </Col>
        </Row>
        <Container className={`${appStyles.Content} align-items-center`}>
          {hasLoaded ? (
            <>
                {mainProfile}
                {mainProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
        {hasLoaded ? (
          <>
            {profilePosts.results.length ? (
              <InfiniteScroll
                children={
                  profilePosts.results.map(post => (
                    <Post key={post?.id} {...post} setPosts={setProfilePosts} />
                  ))
                }
                dataLength={profilePosts.results.length}
                loader={<Asset spinner />}
                hasMore={!!profilePosts.next}
                next={() => fetchMoreData(profilePosts, setProfilePosts)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={noResults} message="This user has no posts yet." />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}

      </Col>
      <Col lg={3} className="d-none d-lg-block">
        <p>?!?Notification?!? and messages for desktop</p>
      </Col>
    </Row>
  );
}


export default ProfilePage


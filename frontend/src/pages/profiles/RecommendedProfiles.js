import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';

import { Container } from 'react-bootstrap'

import styles from '../../styles/PostsPage.module.css'
import appStyles from '../../App.module.css'

import Asset from '../../components/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const RecommendedProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    recommendedProfiles: { results: [] },
  });
  const {recommendedProfiles} = profileData;
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get('/profiles/?ordering=-post_interaction_count/');
        setProfileData(prevState => ({
          ...prevState,
          recommendedProfiles: data
        }))
      } catch (err) {
        console.log(err)
      }
    }

    handleMount();
  }, [currentUser])
  return (
    <Container
      className={`${appStyles.Content} ${styles.SmallComponent}
        ${!mobile && styles.LargeScreen} ${mobile && "d-lg-none text-center"}
        text-center`}>
      
      <h4>Recommended profiles</h4>
      {recommendedProfiles.results.length ? (
        <>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {recommendedProfiles.results.slice(0, 3).map((profile) => (
                <p key={profile.id}>{profile.owner}</p>
              ))}
            </div>
          ) : (
            recommendedProfiles.results.map((profile) => (
              <p key={profile.id}>{profile.owner}</p>
            ))
          )}
          
        </>
      ) : (
        <Asset spinner className="text-center" />
      )}
      
    </Container>
  )
}

export default RecommendedProfiles

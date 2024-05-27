import React from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData } from '../../contexts/ProfileDataContext';

import Container from "react-bootstrap/Container";

import styles from '../../styles/PostsPage.module.css'
import appStyles from '../../App.module.css'

import noResults from '../../assets/no_results.png';
import Asset from '../../components/Asset';
import Profile from './Profile';



const RecommendedProfiles = ({ mobile }) => {
  // RecommendedProfiles component used to display recommended profiles to the logged in user
  // handles fetching recommended profiles data and displaying recommended profiles
  const { recommendedProfiles } = useProfileData();

  const currentUser = useCurrentUser();
  return (
    <Container
      className={`${appStyles.Content} ${styles.SmallComponent}
        ${!mobile && styles.LargeScreen} ${mobile && styles.SmallScreen}
        ${mobile && "d-lg-none"} text-center`}>
      
      <h4>Recommended profiles</h4>
      {currentUser ? (
        recommendedProfiles?.results?.length ? (
          <>
            {mobile ? (
              <div className="d-flex justify-content-around">
                {recommendedProfiles.results.slice(0, 2).map((profile) => (
                  <Profile key={profile.id} profile={profile} mobile />
                ))}
              </div>
            ) : (
              recommendedProfiles?.results?.slice(0, 7).map((profile) => (
                <Profile key={profile.id} profile={profile} />
              ))
            )}
            
          </>
        ) : (
          <Asset spinner className="text-center" />
        )
      ) : (
        <Asset src={noResults} message="Log in to see recommended profiles!" />
      )}
      
      
    </Container>
  )
}

export default RecommendedProfiles

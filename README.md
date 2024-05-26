# [BeeFriend](https://beefriend-5be827b0e8ae.herokuapp.com//)

## Introduction

- BeeFriend is a social media web app that focuses on making friends and connecting with people.

- BeeFriend is targeted towards a wide range of consumers in order to connect with old, new and future friends. The web app lets users share posts and images, send, accept and deny friend requests, explore other users posts, like and comment on them, view their profiles and bio's on them as well as message with other users to start private discussions and conversations.

- I got the idea for this project as I was building a project along side the learning materials. I wanted to expand on the idea of the learning project and create a social media site that would let users interact and connect. The concept for the web app was developed as a play on words and I used the Befriend concept with the Bee, making it a figurative hive for users to buzz and discuss matters in.

## Wireframes

### BeeFriend Desktop

![First sketch - Desktop](frontend/public/images/BeeFriend-Desktop.avif)

### BeeFriend Tablet

![First sketch - Tablet page](frontend/public/images/BeeFriend-Tablet.avif)

### BeeFriend Tablet Inbox page

![First sketch - Tablet Inbox page](frontend/public/images/BeeFriend-Tablet-Inbox.avif)

### BeeFriend Phone page

![First sketch - Phone page](frontend/public/images/BeeFriend-Phone.avif)

### BeeFriend Phone Inbox page

![First sketch - Phone Inbox page](frontend/public/images/BeeFriend-Phone-Inbox.avif)

### BeeFriend Figma design

![Figma design 1](frontend/public/images/BeeFriend-Figma-Design.avif)

![Figma design 1](frontend/public/images/BeeFriend-Figma-Design-login.avif)

### BeeFriend ERD

![ BeeFriend ERD](frontend/public/images/BeeFriend-ERD.avif)

## About the build

- As I started working on this project I created my ERD using [Lucidchart](https://www.lucidchart.com/) to map out the models I would need and to help with the planning and designing process. After creating them I sketched out my wireframes using [Balsamiq](https://balsamiq.com/). Even before starting to design the project, I had an image in my head as to what I wanted it to look like, so I decided to work out my complete desing, I used [Figma](https://www.figma.com/) to create my second wireframes with colors, images and styles. And then I moved to creating the repository, adding the user stories for both the DRF API and Frontend web app with labels and iteration milestone, preparing the workspace and starting to code the project.

- To better prepare for the project I went through the older learning material and watched couple of videos and tutorials in order to refresh and expand my knowledge on the topics and frameworks and libraries necessary for the project.

### Preparing the workspace

- After creating the repository and opening my workspace in VS Code through gitpod, I installed Django and created my DRF API project file in the top directory, created my first app called profiles following the lesson material. I started setting up all of the starting requirements, Cloudinary for storing the images, PostgreSQL database to store my data, connecting with Heroku for deploying the project.

- First I created the DRF API necessary for the project I created Post, Comment, Like, Friend, Chat and Notification(**later removed model**) Models using the ERD's I have drawn out using Lucidchart to the blog app that were necessary to handle and store user data for the project in the database. Using generic views and serializers to create all of them.

- While creating my API I was unable to figure out how to create an appropreate Notification views and serializers to handle automatic creation of notification on each like, comment, new friend request, friend request response, new message, I reserched and tried implementing the Django Signals in order to create the notifications on save/submit of the requests, but were unable to code it properly to work as imagined, while discussing it with my mentor he mentioned the WebSockets could do the job, but I decided I would come back to the notifications if I would have time towards the end of the project. After noticing I wouldn't have enough time to make them 100% functional and as imagined, I decided to remove them from this project for the moment, and leave them as possible future features in order to focus properly on other parts of the project.

- After finishing with the DRF API I continued on and started coding the frontend using JSX, html and css, React and React Bootstrap, I created the homepage with Navbar and the background image, before proceeding onto the all of the components necessary to create my envisioned project.

- DRF API has been secured and only the data has been restricted and confidential data is only visible to the users they relate to. I.E. Chats and messages can only be viewed and read by the users that are participating in the conversation.

## Features

### Navigation Bar
- The navigation bar is fully responsive, it shrinks and expands with the screen change. On smaller devices it collapses into a toggle switch.
- The nav bar is fully visible and fixed to the top of the screen
- The navigation links respond with size and collapse into a toggle switch that when clicked on displays all of the links as a list beneath the navigation bar. Each navigation link is underlined when the page is active for each page user is on, on hover the icons next to the link bounce and the link text color changes to orange as a resoponse to user interaction.
- The logo is fully interactive and when clicked will take user to the homepage.
- The navigation links change depending on whether the user is logged in or not. When logged out visible links are: Home, Log In and Register, and when user is logged in they change to: Home, Friends, Profile and Log Out on **large** screen, and to: Home, Friends, Inbox, Profile and Log Out on **mediuem** screen or smaller.
- For all of the page alerts I used **react-toastify** package in order to display expiring alerts that don't require users to click on them to remove them. They display either as success(green) or error(red) messages, depending on the alert style.
- The hero image is displayed beneath the whole web app. The image adjusts with the screen size and is fully responsive.
- 

Navbar - Logged Out
![Navbar - Logged Out](frontend/public/images/BeeFriend-NavBar-Logged-Out.avif)

Navbar - Logged In
![Navbar - Logged In](frontend/public/images/BeeFriend-NavBar-Logged-In.avif)

Navbar - Logged In Toastify Message
![Navbar - Logged In Toastify Message](frontend/public/images/BeeFriend-NavBar-Logged-In-Toastify-Message.avif)

Navbar - Link Hover Effect
![Navbar - Link Hover Effect](frontend/public/images/BeeFriend-NavBar-Link-Hover.avif)

### Search Bar Section
- The search bar section is located beneath the NavBar and at the middle of the screen.
- When the user is logged out it consists of only search bar, but while user is logged in, it consists of the new post button on the left, search bar in the middle and filter dropdown on the right.
- Users can use the search bar to filter/search by entering username, title or content, if any part or word matches to the searched word, the filtered content will be displayed.
- New post link will take users to the create a new post page. While filter dropdown will let users filter posts by all posts, posts they have liked and posts they have commented on. Both are styled as buttons that respond to hover and focus with color change.

Search Bar - Logged Out
![Search Bar - Logged Out](frontend/public/images/BeeFriend-Search-Bar-Logged-Out.avif)

Search Bar - Logged In
![Search Bar - Logged In](frontend/public/images/BeeFriend-Search-Bar-Logged-In.avif)

Search Bar - Filter Dropdown
![Search Bar - Filter Dropdown](frontend/public/images/BeeFriend-Search-Bar-Filter-Dropdown.avif)


### Recommended Profiles
- Recommended profiles are located on the left next to the search bar on large screens, and above the search bar on small screens, just beneath the NavBar.
- Recommended profiles are only shown while user is logged in, and are hidden when user is logged out.
- Recommended profiles display 7 profiles on the large screens, and 2 on medium and smaller screens.
- Each recommended profile image can be clicked in order to head on over to their profile page.
- Next to each profile inside recommended profiles there will be a button: 
    * BeeFriend button (i.e. Add a friend button) = new profiles and not connected already;
    * Cancel button = logged in user is the one that sent the friend request;
    * Accept/Deny buttons (displayed as hex tick and x buttons) = logged in user received a friend request
    * UnFriend button (i.e. Remove friend) = Existing friends, already connected
    * Nothing = if the user is logged in and an owner of the profile, they won't see any buttons next to it
- The buttons are only displayed on the large screens, and are hidden on the medium and smaller screens
- Recommended profiles are displayed on Home page, Profile page and each of the Post pages

Recommended Profiles
![Recommended Profiles](frontend/public/images/BeeFriend-Recommended-Profiles.avif)

### Friends
- Friends are located on the left beneath the Recommended Profiles, and above the search bar and to the right of the Recommended Profiles on small screens, just beneath the NavBar.
- Friends are only shown while user is logged in, and are hidden when user is logged out.
- Friends display 7 profiles on the large screens, and 2 on medium and smaller screens.
- Each friend image can be clicked in order to head on over to their profile page.
- Next to each friend there will be a button: 
    * UnFriend button (i.e. Remove friend) = Existing friends, already connected
- The buttons are only displayed on the large screens, and are hidden on the medium and smaller screens
- Friends are displayed on Home page, Profile page and each of the Post pages

Friends
![Friends](frontend/public/images/BeeFriend-Friends.avif)

### Inbox
- Inbox is located on the right next to the search bar on large screens, it is hidden on medium and smaller screens and is located among the NavBar links, which redirect user to the special page, not available for large screens.
- Inbox is only shown while user is logged in, and is hidden when user is logged out.
- Inbox consists of the search bar and a Chat button, followed by the profiles user has existing messages with.
- Search bar takes the input of the username, and on the press of the Chat button compares the username to the existing users usernames and reads user id to create a new chat.
- User that created the chat can delete the existing chat with the other user.
- If the chat exists, user can click on the username to open the messenger to view and send messages.
- Inbox is displayed on Home page, Profile page and each of the Post pages

Inbox
![Inbox](frontend/public/images/BeeFriend-Inbox.avif)

### Messenger
- Messenger is located on the right beneath the Inbox on large screens, after the chat is selected inside the Inbox, it is hidden on medium and smaller screens and is located with the Inbox on the special page.
- Messenger is only shown while user is logged in, and is hidden when user is logged out. Additionally it is hidden until user select a chat or when they exit the chat they are currently in.
- Messenger consists of the existing messages, received on the left and sent on the right of the component, with time indicating how long ago has the message been received, and the message input text area with a send button (plane inside a hex box).
- Currently the individual messages can not be deleted. Will be added in the future updates, was skipped due to time constraint for the project.
- If a user wants to send a message to a different user, they can click onto the different user in the Inbox and switch to the selected user, or they can exit opened chat by pressing the X in the top right corner.
- Small avatar image will be displayed in the top left corner of the component, indicating which user are you messaging with.
- Messenger stays open even when the user switches between the pages, but is closed when user logs out or clicks exit button.
- Messenger is displayed on Home page, Profile page and each of the Post pages

Inbox - Messenger
![Inbox - Messenger](frontend/public/images/BeeFriend-Inbox-Messenger.avif)

### Homepage - Posts
- Posts on the homepage are displayed in the center of the page, just beneath the search bar component.
- Posts are displayed in the descending order, from newest to oldest. Infinite scroll has been set up to avoid having to click next page in order to continue exploring.
- Users can like the posts directly on the homepage, by clicking the heart button, users can't like their own posts, they can like a post once, after which they can dislike it.
- In order the user wants to read or leave a comment on a post they have to proceed to post page by clicking onto the image, or a comment icon.

Homepage
![Homepage](frontend/public/images/BeeFriend-Homepage.avif)

Homepage with Messenger
![Homepage with Messenger](frontend/public/images/BeeFriend-Homepage-2.avif)

### Post Page
- Post Page displays the selected post as the main focal point on the page, with existing comments listed in descending order by creation date (newest first) beneath the post.
- Logged in users can like and comment on the post, while logged out users can only read them.
- Logged in users can edit or delete their own existing comments, if user decides to edit the comment will be saved, but it will keep it's location
- If avatar image is clicked on any of the posts, user will be taken to the post owners profile.
- If a logged in user is a post owner,

Post Page
![Post Page](frontend/public/images/BeeFriend-Post-Page.avif)

### Friends Page
- Friends Page filters and displays all of the friends post.
- Each user will have different posts displayed depending on their friends.

Friends Page
![Friends Page](frontend/public/images/BeeFriend-Friends-Page.avif)

### Profile Page
- Profile Page displays all of the large profile image, stats, information and posts from the profile owner. If the profile viewed is from another user in the top right corner there will be a BeeFriend (Add a friend), Unfriend, Cancel, Accept or Deny button, depending on the friend/friend request state.
- The stats available on the profile are:
    * Post count
    * Post interaction count
    * Friend count
- Each user can write a bio that will be displayed beneath the stats.
- All of the users posts will be displayed beneath the profile information area.

Profile Page - No Posts
![Profile Page - No Posts](frontend/public/images/BeeFriend-Profile-Page.avif)

Profile Page - With Posts
![Profile Page - With Posts](frontend/public/images/BeeFriend-Profile-Page-2.avif)

Profile Page From Another User
![Profile Page From Another User](frontend/public/images/BeeFriend-Profile-Page-Other-Users-Profile.avif)

Profile Page - Info, Stats and Bio
![Profile Page - Info, Stats and Bio](frontend/public/images/BeeFriend-Profile-Page-Info.avif)

### Register, Login and Log out
- While logged out the user won't be able to interact with the site fully. They won't be able to write or edit post and comments and they won't be able to like posts or send messages. They can not see recommended and friends profiles components, friends page and profile page as well as inbox and messenger components. The site has been secured by using permissions from django rest functions and the redirect at the front end using a React hook, if user tries to access the edit/write page they will be redirected to login page.
- ***Register*** - The users can register and create an account to access the sites full functions.
- ***Login*** - After registering and creating an account the user is redirected to the login page, where they can log in and start writing posts, commenting on existing posts or like them. On successful log in user will be taken to the home page.
- ***Logout*** - While logged in a user can decide to logout at any point, when the logout is clicked, it will log user out and redirect user to the home page. While logged out user is restricted from using the site fully. 

### Features left to implement
- 

### Possible future features
- ***Notifications*** - Automatic notification creation on sent, accepted/denied friend request, liked or commented posts, new messages, etc.
- ***Drafts*** - Users can write drafts and save unfinished posts to continue later and start where they left off.
- ***Social Media*** - Users can share their favourite posts directly on social media and the article data is compressed to display basic information to be shared on other platforms along side the picture if existing.
- ***Images*** - Users can add multiple images to the same post.
- ***Messaging*** - Users can start messaging directly from the profile page, users can delete individual messages, group chats.

## Security features
- The project was secured using Django Rest permissions and React redirect hook which are protecting the views to write and edit posts and comments, users cannot bypass and type in a write/edit urls to make changes to the site content.
- Regular users can't access the admin panel, only superusers are allowed the access to the admin panel.
- SECRET_KEY, DATABASE_URL and CLOUDINARY_URL were stored inside the env.py and config vars the whole time, and were not leaked in the github repository.

## Testing

|           Action            |        Expectation                           | Outcome |
| :-------------------------: |   :-------------------------------------:    | :-----: |
|           Homepage        |   The homepage loads on page start        |  Pass   |
|       Navigation bar      |   The navigation bar responds to screen size change |  Pass   |
|       Logo       |        When clicked User is taken to homepage          |  Pass   |
|       Nav link - home     |      When clicked User is taken to homepage    |  Pass   |
|   Nav link - Friends   |      When clicked User is taken to friends page  |  Pass   |
|          Friends Page       |   The friends page loads without issues    |  Pass   |
|       Nav link - Profile  |      When clicked User is taken to the profile page   |  Pass   |
|           Profile Page        |   The profile page loads without issues        |  Pass   |
|       Nav link - Register  |      When clicked User is taken to register page, if user is logged in, they are redirected to the homepage   |  Pass   |
|           Register        |   The register page loads without issues, on successful registration redirects user to the login page        |  Pass   |
|       Nav link - Log In    |      When clicked User is taken to login page, if user is logged in, they are redirected to the homepage   |  Pass   |
|           Log In        |   The login page loads without issues, on sucessful login redirects user to the homepage       |  Pass   |
|       Nav link - Log Out   |      When clicked User is logged out, after which they are redirected to the homepage   |  Pass   |
|       Navigation bar:active link    |   The navigation bar link is underlined when user is on matching page |  Pass   |
|       Navigation bar - small screens     |   The navigation bar links are collapsed into a toggle switch, that when clicked displays list of links |  Pass   |
|       Navigation bar links:hover     |   The navigation bar links change color to orange when hovered and the icon is bouncing to indicate hovered on element |  Pass   |
|       Navigation bar - logged out     |   The navigation bar displays Home, Log In and Register links when user is not logged in |  Pass   |
|       Navigation bar - logged in     |   The navigation bar displays Home, Friends, Profile and Log Out links when user is logged in |  Pass   |
|       Navigation bar - logged in - small screen     |   The navigation bar displays additional link Inbox when user is logged in and on medium or smaller screen device |  Pass   |
|       User status message     |   User status message pops up as a fleeting alert upon successful log in  |  Pass   |
|       Background image        |        Loads successfully upon page open. Responds with screen size change          |  Pass   |
|       Homepage - logged out        |        The additional features are hidden until user logs in, displays a search bar and posts on screen take up more space than when logged in.       |  Pass   |
|       Homepage - logged in        |        The additional features are displayed as soon as the user logs in, displays a advanced search bar, posts, recommended and friends profiles along with inbox components        |  Pass   |
|       Recommended profiles        |         Displays correctly and Avatars, usernames and buttons are visible. Displays on the top left beneath the navbar on both large and small screens          |  Pass   |
|       Recommended profiles - buttons       |         Buttons display depending on the different friends status. When clicked th button either adds, accepts, denies, cancels or removes a friend, depending ot he button type          |  Pass   |
|       Friends profiles        |         Displays correctly and Avatars, usernames and buttons are visible. Displays on the top left beneath the recommended profiles on large and on the right beneath the navbar on small screens          |  Pass   |
|       Friends profiles - buttons       |         Unfriend buttons are displayed correctly. Removes friend from list when button is clicked          |  Pass   |
|       Search Bar       |        Displays in the top center, beneath the navbar on large screens and beneath recommended and friends profiles on small screens. On input filters the content by username, title or body content          |  Pass   |
|       Search Bar - logged out      |        When user is logged out only displays the search bar along the full width of the content bar          |  Pass   |
|       Search Bar - logged in      |        When logged in the search bar displays New Post button to the left, search bar in the middle and filter dropdown on the right          |  Pass   |
|       Inbox       |        Displayed only on large screen devices in the top right, beneath the navbar while user is logged in. Displays a input bar, submit button and list of existing chats and user avatar and username.           |  Pass   |
|       Inbox - input field      |        On input and submit (***enter or press on the button***), checks typed username against existing profiles and existing chat instances and if user exists and chat instance doesn't creates a new chat.           |  Pass   |
|       Inbox - existing chat      |        When user clicks on the existing chat instance, the messenger component is generated and displayed beneath the Inbox component.           |  Pass   |
|       Inbox - delete option      |        If a user is the owner/creator of the chat instance, they can delete the chat and all of the messages within it.           |  Pass   |
|       Messenger      |        If there are no messages, user is informed of it via message. Received messages are displayed on the left and sent messages on the right of the component. On submit, the messages are sent and saved in the database. Avatar image is visible in the top right corner, to inform user on whom they are messagin with.           |  Pass   |
|       Messenger - exit       |       When exit button is clicked the messenger stops and is not visible on the screen. The messenger is automatically closed when user logs out.          |  Pass   |
|           Add Post        |   On click, redirects logged in user to the create post page, where they can decide to add an image, title and/or body. Title field is mandatory, image and body are not mandatory fields, letting user post an image, or just a brief status.       |  Pass   |
|           Add Post - buttons       |   Create post page is supplied with two buttons, cancel which redirect user back to the previous page, and Post button, which saves the post to the database and redirects user to the published post page.       |  Pass   |
|           Post Page       |   Displays the selected or just published post on the page, with all of the comments beneath it. If current user is the owner of the post, they have Post Dropdown, that lets them either edit or delete post       |  Pass   |
|           Post Page - Edit button      |   On click, redirects user to the edit page, automatically filling the existing post data fields(image for existing image post, title for title and body for body content)       |  Pass   |
|           Edit Post        |   User they can decide to change or add an image, title and/or body. Title field is mandatory, image and body are not mandatory fields.       |  Pass   |
|           Edit Post - buttons       |   Create post page is supplied with two buttons, cancel which redirect user back to the previous page, and Post button, which saves the edits existing post in the database and redirects user to the published post page.       |  Pass   |
|           Post Page -delete button       |   On click deletes the post and all of the connected likes and comments from the database       |  Pass   |
|           Post Page - like      |   Logged in user can like the post they do not own and unlike previously liked posts, same as on rest of the pages. When post is liked or unliked, like count is incremented, reflecting the correct count        |  Pass   |
|           Post Page - comment      |   While on post page, any user can read and view existing comments, logged in users can add new, edit or delete their existing comments. when comment is added or deleted the comment count is incremented, reflecting the correct count, updated comments do not change the comment count.       |  Pass   |
|           Post Page - comment add      |   New comment is posted and displayed at the top of the comment section, current time is posted as post date(how long ago was the post made)       |  Pass   |
|           Post Page - comment edit      |   Edited comment is posted and displayed at the same position in the comment section, the posted time is displayed, indicating that the post has been updated      |  Pass   |
|           Post Page - comment delete      |   Deleted comment is removed from the database and no longer exists or displays underneath the post      |  Pass   |
|       Profile Page       |       On open the profile page displays larger user avatar image, profile owner username, stats, conditionally bio and posts they have made.          |  Pass   |
|       Profile Page - stats       |        Stats displayed are: Post count, Post interactions (liked and commented posts count), and Friends count. The counts change and update with changes         |  Pass   |
|       Profile Page - bio       |        Bio is displayed only if a user added a bio, it is located beneath the stats         |  Pass   |
|       Profile Page - Posts       |        Posts are displayed beneath the Profile info section in descending order         |  Pass   |
|       Profile Page - Owner       |        Profile owner can see Dropdown menu at the top right corner of the info section.          |  Pass   |
|       Profile Page - Owner Dropdown      |        Dropdown displays: Edit profile, Change username and Change password options. Each of the three options have cancel, redirect users to previous page, and save, updates the information in the database and displayed data on the front end, buttons          |  Pass   |
|       Profile Page - Owner Edit profile      |         Edit profile allows for the user to change their Profile Image and/or Bio         |  Pass   |
|       Profile Page - Owner change username      |         Change username lets users choose a different username, username has to be unique.         |  Pass   |
|       Profile Page - Owner change username      |         Change username lets users choose a different username, username has to be unique.         |  Pass   |
|       Profile Page - Not owner       |        If user is viewing another users profile, they will see a button to send, remove, accept, deny or cancel a friend request to the profile owner.         |  Pass   |
|       Inbox page        |       Inbox page link is hidden on the large screen, but displayed on medium or smaller screens. When accessed on large screen, user can see a message indicating it is dedicated for smaller screens. Displays inbox and when chat is selected messenger together so messenger can be used on smaller screens as well as larger ones.           |  Pass   |
|      User Profile CRUD functionalities      |        Users can create a profile by registering, and logged in users can update their profiles, while all users can read the profile data.          |  Pass   |
|      User Post CRUD functionalities      |        Logged in users can create, read, update and delete their own posts, while logged out users can only read existing posts          |  Pass   |
|      User Like CRUD functionalities     |         Logged in users can create, read and delete their likes on other users posts          |  Pass   |
|      User Comment CRUD functionalities      |        Logged in users can create, read, update and delete their own comments on their own or other users posts.          |  Pass   |
|      User Inbox CRUD functionalities      |        Logged in users can create, read and delete their chats with other users          |  Pass   |
|      User Messenger CRUD functionalities      |        Logged in users can create and read all of the messages they have shared with another user          |  Pass   |
|      DRF API functionalities      |        Users can have restricted access to the DRF API and can't access confidential data, like private chats from other users, they can only view their own chats.          |  Pass   |

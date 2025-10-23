# Variety Agency Project

## Description

The project is a web application to showcase the artist and events of the Berlin-based DJ collective called Variety. As an admin of the page you can add artists and tour dates for the showcases of the Variety collective and it's artists for interested music-fans to see.

## User Stories

-  **Signup:** As an anon I can sign up in the platform so that I can start saving favorite restaurants
-  **Login:** As a user I can login to the platform so that I can add tour dates of the Variety artists.
-  **Logout:** As a user I can logout from the platform so no one else can use it
-  **Add Artists** As an admin I can add an artist so that I can share it with the community
-  **List Artists** As a user I want to see the artists so that I can choose where to go for my next event
-  **Add Events** As an admin I can add an events so that I can share it with the community
-  **List Events** As a user I want to see the events so that I can choose where to go for my next event
-  **Search Artists** As a user I want to search artists by name so that I know if it´s already in the platform

## Backlog

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
User profile:
- update password
- 

  
# Client

## Routes

- / - Homepage
- /auth/signup - Signup form
- /auth/login - Login form
- /events - event list
- /artists - artist list
- /create - create a restaurant
- /events/:id - event detail
- /artists/:id - artists detail
- /profile - my details
- 404

## Pages

- Home Page (public)
- Sign in Page (anon only)
- Log in Page (anon only)
- Event List Page (public only)
- Event Create (user only)
- Event Detail Page (public only)
- Artist List Page (public only)
- Artist Create (user only)
- Artist Detail Page (public only)
- My Profile Page (user only)
- 404 Page (public)

## Components

- Event Card component
  - Input: event: any
  - Output: favorite(eventId: string, on: boolean)
  - Artist Card component
  - Input: artist: any
  - Output: favorite(artistId: string, on: boolean)
- Search component
  - Output: change(terms: string)


## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - profile(user)
  - auth.getUser() // synchronous
- Event Service
  - event.list()
  - event.create(data)
- Artist Service
  - artist.list()
  - artist.create(data)  
  
# Server

## Models

User model

```
username - String // required
email - String // required & unique
password - String // required
```

Event model

```
owner - ObjectID<User> // required
eventName - String // required
location - String
date - Date
artworkUrl - String
lineUp - array of Artists
ticketPrice
```

Artist model

```
owner - ObjectID<User> // required
firstName - String
lastName - String
artistName - String
artistPicUrl - String
soundCloudUrl - String
beatportUrl - String
instagramUrl - String
facebookUrl - String
webpage - String
```

## API Endpoints/Backend Routes

- GET /auth/me
- POST /auth/signup
  - body:
    - username
    - email
    - password
- POST /auth/login
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)
- POST /user/me/favorite
  - body:
    - restaurantId
- DELETE /user/me/favorite/:restaurantId
  - body: (empty)
- GET /restaurant
- POST /restaurant
  - body:
    - name
    - phone
    - address
- GET /restaurant/:id

  

## Links

### Trello/Kanban

[Link to your trello board](https://trello.com) or picture of your physical board
![Screenshot - Iteration 5](https://www.dropbox.com/s/hvq7x002tdpq1du/Trello%20Variety%20Project.png?dl=0)


### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/robine81/frontend-variety)
[Server repository Link](https://github.com/robine81/backend-variety)

[Deploy Link](https://serene-swan-2b9f44.netlify.app/)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
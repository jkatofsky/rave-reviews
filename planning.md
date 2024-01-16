## Backend:

### TODO:

- Incorporate a tag system
- User authentication + user profiles (this might be really important for people to flex the clubs they've been to)

### Data model

- Organizer
  - id
  - name
  - type (bar/club, concert venue, collective, festival)
  - coords
  - city (to be determined based on coords somehow)
  - average rating (average of reviews; updated when making new review)
  <!-- TODO: also average ratings for all of the different types -->
- Review
  - id
  - *Organizer
  - Description
  - Genres
  - Money spent on the night
  - Ratings (1/10)
    - Sound system
    - DJ/Music
    - Crowd PLUR
    - Staff
    - Food & drink
    - Visuals
    - Safety & Comfort
  - Images

### Endpoints

- `/organizers` (paginated)
  - list of organizers
- `/organizers/:organizerId`
  - just that venue
- `/reviews/:organizerId` (paginated)
  - list of reviews for an organizer
- non user-defined data that should live on the backend nonetheless:
  - `/genres`
    - list of viable genres
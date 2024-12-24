# TODOs

Global TODOs that are more natural here than the code itself

## Features

- [ ] finish the locations feature
  - [x] displaying data
  - [x] filtering
  - [ ] using an API to get the data for cities that aren't yet in the table - Google maps?
- [ ] user profiles and auth
  - [ ] anonymous/public profiles
  - [ ] only users can create reviews
  - [ ] only users with certain "reputation" can create organizers
  - [ ] public profiles show reviews and stats, top genres, organizers, etc. Gameified
  - [ ] associated with review models
  - [ ] different roles: (user, mod(?), admin)
- [ ] images on reviews
- [ ] review upvotes (also associated with users)
- [ ] highlighting the matching things in organizers results
- [ ] organizer editing by users with certain "reputation"
  - [ ] need new table that saves all revisions for rollbacks
- [ ] review editing (maybe also with revisions?)
- [ ] organizer + review + user reporting
- [ ] LLM-generated organizer descriptions
- [ ] endpoint for "X stars on rave reviews" badges on 3rd party sites
- [ ] god-mode dashboard for me and the homies
- [ ] nice home page and "about" the project page
  - [ ] a "buy me a coffee" type button
- [ ] percantages for different genres on organizers?

## In the code

### Frontend

- [x] use `react-query` everywhere for client-side fetching
- [x] debounce necessary fetching
- [ ] create a Mantine theme for the whole app
- [ ] do form validation with Zod (generate schemas from Prisma?)
  - [ ] block saving with bad values
- [ ] loading states (both client-side and via next.js loading layouts)
- [ ] reset forms after closing modals or submitting them
- [ ] combine `OrganizerInfo` and `OrganizerCard` into one component?

### Backend

### Repo-wide

- [ ] fix the messed up spacing on GitHub
- [ ] do a suite of (actually useful) unit tests
- [ ] nice readme

### Infra

- [ ] make tests run before prod deployment
- [ ] re-enable branch previews but make them use a different DB than prod
- [ ] analytics suite
- [ ] logging of some sort?

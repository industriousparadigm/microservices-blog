# Microservices blog

The fun here is all about implementing a microservices-based architecture. Every service should be independent of the others, etc.

Otherwise, it's just the simplest Node-React app - I can create a post or comment on it. Changes are only reflected on refresh and they persist only in memory.

This project is part of a [2020 Microservices course](https://www.udemy.com/course/microservices-with-node-js-and-react) by Stephen Grider.

## Get app up and running

1. Clone this repo.
2. Open a separate terminal window for each of the 5 service folders (`posts`, `comments`, `moderation`, `query`, `event-bus`), plus one for the React app (`client`).
3. In each window, run `npm i && npm start`.
4. The React App should be running on `http://localhost:3000`.
5. Profit
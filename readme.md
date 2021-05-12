# Hangman

This project was done for the course Distributed Systems & Blockchain 1 at the OST University of Applied Sciences.

## Description

This is a distributed implementation of the game Hangman. The server runs on Express. The front-end was implemented using server-side rendering. MongoDB was used as database and Traefik as load balancer. All Services run in Docker. The Authentication was implemented using JWT.  
If a player correctly guesses a word, his score is incremented by one. The ranking displays the top five players.
The game is lost, when seven characters were wrongly guessed.

## Start 

### Development 

`docker-compose up` 

Starts MongoDB and Traefik. 

`npm run startexpress` 

Starts the hangman service. This way, the database and the load-balancer do not have to be restarted when working on the back-end.
Hangman is available under http://www.localhost:80 (via load-balancer).

### Production

`docker-compose -f docker-compose.production.yml up` or `npm run production`

Starts MongoDB, Traefik and two instances of the hangman service.
Hangman is available under http://www.localhost:80 (via load-balancer).

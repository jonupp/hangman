# Hangman

## Description

This is a distributed implementation of the game Hangman. The server runs on Express. The front-end was implemented using server-side rendering. MongoDB was used as database and Traefik as load balancer. All Services run in Docker. Authentication was implemented using JWT.  
If a player correctly guesses a word, his score is incremented by one. The ranking displays the five highly-placed players.
The game is lost, when seven characters were wrongly guessed.

## Start 

### Development 

`docker-compose up` 

Starts MongoDB and traefik. 

`npm run startexpress` 

Starts the hangman service. This way, the database and the load balance do not have to be restarted when working on the back-end.
Hangman is available under http://www.localhost:80 (via load-balancer).

### Production

`docker-compose -f docker-compose.production.yml up` or `npm run production`

Starts MongoDB, traefik and two instances of the hangman service.
Hangman is available under http://www.localhost:80 (via load-balancer).

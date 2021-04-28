# Hangman

## Description

This is a distributed implementation of the game Hangman. MongoDB was used as database and traefik as load balancer. All Services run in Docker. Authentication was implemented using JWT.  

## Start 

### Development 

`docker-compose up` 

Starts MongoDB and traefik. 

`npm run startexpress` 

Starts the hangman service. This way, the database and the load balance do not have to be restarted when working on the back-end.
Hangman is available under http://www.localhost:80 (via load-balancer).

### Production

`docker-compose -f docker-compose.release up` or `npm run production`

Starts MongoDB, traefik and two instances of the hangman service.
Hangman is available under http://www.localhost:80 (via load-balancer).

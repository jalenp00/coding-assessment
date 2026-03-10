## Installation Guide
`docker compose build`
<br> `docker compose up`

## Architecture
### Server
- NestJS
- Prisma
<p> I decided to go with this as this is this is the tech stack of choice for the position.
I took this opportunity to get hands on experience with it.</p>

### Database
- Postgres
<p> I chose postgres because it is industry standard. It supports the use case and is ACID compliant.</p>

### Docker
<p> I chose to dockerize the server because the assignment stated 'production' ready. Docker allows ease of use and scale.
<br> Postgres is also in a container that way this application can be packaged through the docker compose and ran with little setup.
<br> Usually, you would not want to put your database in a container, you would want to use a cloud database service but it fits this use case.
<br> You will notice when spinning up, some test cases have ran. My primary way of testing the api was through the default testing service the NestJs provides.
<br> I used that in combination with postman for testing.</p>

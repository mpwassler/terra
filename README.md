# Setup

Runs in docker start with `docker-compose up`

To prep the DB and install npm dependancies run `./scripts/bootstrap.sh`

`docker-compose exec app yarn --pure-lockfile` to just install node modules

Requires a `MAPBOX_API_TOKEN` ENV variable be set. Either via export from a shell config or in a `.env` file. 

# Linting 

Run `./scripts/lint.sh` to run linters (rubocop and standardjs)
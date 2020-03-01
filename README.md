# Setup

Runs in docker start with `docker-compose up`

To prep the DB run `./scripts/bootstrap.sh`

Requires a `MAPBOX_API_TOKEN` ENV variable be set. Either via export from a shell config or in a `.env` file. 

# Linting 

Run `./scripts/lint.sh` to run linters (rubocop and standardjs)
#!/bin/bash -e
docker-compose exec app yarn --pure-lockfile
docker-compose exec app bundle exec rails db:create db:migrate
docker-compose exec app bundle exec rails db:create db:migrate RAILS_ENV=test
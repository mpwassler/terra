#!/bin/bash -e
docker-compose exec app bundle exec rails db:create db:migrate
#!/bin/bash -e
docker-compose exec app rubocop
docker-compose exec app yarn lint
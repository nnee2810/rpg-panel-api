aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 526510891582.dkr.ecr.ap-southeast-1.amazonaws.com
docker compose down
docker compose pull
docker compose up -d
# Backend service for Chinisik

## Local Development

> Required dependencies

- `deno` is used to install packages and for runtime environment

> Run project

- `deno install` installing dependencies
- `deno run dev` starting development mode

```md
✨ default server listening on the port 8080

🌱 REST endpoints
http://localhost:8000/api
```

### In order for everything to work correctly, the PostgreSQL database must be up and running.

```bash
docker run -p 5432:5432 \
  --name chinisik-postgres \
  -e POSTGRES_PASSWORD=chinisik \
  -e POSTGRES_USER=chinisik \
  -e POSTGRES_DB=chinisik_dev \
  -d \
  --restart always \
  postgres:latest
```

After launching, perform migrations and seeding of all data, this can be done by writing:

- `bun run prisma:reset`

## Build image and run

### Build

```
docker buildx build -t chinisik-back .
```

### Run

```
docker run -d \
  --name chinisik-back \
  -p 8080:8080 \
  --env-file .env \
  chinisik-back
```

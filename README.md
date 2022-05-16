<p align="center"><img src="https://stickeryouwant.com.ua/src/apps/admin/files/product-photo-1616949258925.png" width="400"></p>


## Description

Test app made with nest

## Requirements
<ul>
  <li>Node >= 16</li>
  <li>Docker or Postgre installed</li>
</ul>

## Installation

```bash
npm install
cp .env.example .env
#Change credentials if needed.
#if you do not have docker installed, pls connect to your locally installed postgres
#Edit db/01-init.sh if you did change credentials.
docker-compose up -d
npx prisma migrate dev
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```


## License

Nest is [MIT licensed](LICENSE).

# next-ecommerce-store

A non-real ecommerce store for selling chocolates.

## Dependencies

- [Next](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Postgres.js](https://github.com/porsager/postgres)
- [Tailwindcss](https://tailwindcss.com/)
- [Redux](https://react-redux.js.org/)
- [Stripe](https://stripe.com/at)
- [JS Cookie](https://github.com/js-cookie/js-cookie)
- [dotenv-safe](https://github.com/rolodato/dotenv-safe)
- [ley](https://github.com/lukeed/ley)

## Setup

Clone the repo from GitHub and then install the dependencies:

```sh
git clone https://github.com/Thoud/next-ecommerce-store
cd next-ecommerce-store
yarn
```

Setup a database with postgres on your machine:

```sh
psql <login>
CREATE DATABASE <database name>;
CREATE USER <username> WITH ENCRYPTED PASSWORD '<pw>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
```

Create a .env file with the credentials for the database inside your project directory.
(Use .env.example as a template to create the file)

Use migration to populate the database:

```sh
yarn migrate up
```

If you need to delete the data again from the database you can use:

```sh
yarn migrate down
```

To run the development server:

```sh
yarn dev
```

To create the production build of the project run:

```sh
yarn build
yarn start
```

## Deployment

Create a Heroku account at [Heroku - Sign up](https://signup.heroku.com/), and then follow the instructions there to deploy from GitHub.

## Preview

![Preview of Homepage](/public/home.png 'Preview of Homepage')
![Preview of the products page](/public/products.png 'Preview of the products page')
![Preview of a single product](/public/product.png 'Preview of a single product')
![Preview of the stripe checkout](/public/stripe.png 'Preview of the stripe checkout')
![Preview of the order history](/public/history.png 'Preview of the order history')

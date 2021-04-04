import setPostgresDefaultsOnHeroku from './util/setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();

type Options = {
  ssl?: { rejectUnauthorized: boolean };
};

const options: Options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

export default options;

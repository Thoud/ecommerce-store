exports.up = async (sql) => {
  await sql`CREATE TABLE users (
		id SERIAL PRIMARY KEY,
		username VARCHAR UNIQUE,
		password_hash VARCHAR,
		profile_url VARCHAR
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users`;
};

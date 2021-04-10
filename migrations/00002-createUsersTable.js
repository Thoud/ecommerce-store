exports.up = async (sql) => {
  await sql`CREATE TABLE users (
		id SERIAL PRIMARY KEY,
		username VARCHAR UNIQUE,
		email VARCHAR,
		first_name VARCHAR,
		last_name VARCHAR,
		birthday VARCHAR,
		address VARCHAR,
		city VARCHAR,
		zip_code VARCHAR,
		phone_number VARCHAR,
		password_hash VARCHAR,
		profile_url VARCHAR
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users`;
};

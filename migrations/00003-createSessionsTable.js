exports.up = async (sql) => {
  await sql`CREATE TABLE sessions (
		id SERIAL PRIMARY KEY,
		token VARCHAR UNIQUE,
		expiry TIMESTAMP DEFAULT NOW() + INTERVAL '7 Day',
		user_id INT REFERENCES users (id)
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE sessions`;
};

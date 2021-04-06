exports.up = async (sql) => {
  await sql`CREATE TABLE sessions (
		id SERIAL PRIMARY KEY,
		token VARCHAR,
		expiry TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE sessions`;
};

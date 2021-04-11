exports.up = async (sql) => {
  await sql`CREATE TABLE orders (
		id SERIAL PRIMARY KEY,
		order_date VARCHAR DEFAULT NOW(),
		order_information JSON,
		first_name VARCHAR,
    last_name VARCHAR,
    address VARCHAR,
    city VARCHAR,
    zip_code VARCHAR,
    shipping_first_name VARCHAR,
    shipping_last_name VARCHAR,
    shipping_address VARCHAR,
    shipping_city VARCHAR,
    shipping_zip_code VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    stripe_session_id VARCHAR,
    payment_completed BOOLEAN,
		user_id INT REFERENCES users (id)
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE orders`;
};

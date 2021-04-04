export async function up(sql) {
  await sql`CREATE TABLE chocolates(
		id SERIAL PRIMARY KEY,
		name VARCHAR NOT NULL,
		description VARCHAR,
		ingredients VARCHAR,
		allergens VARCHAR,
		img_path VARCHAR,
		price VARCHAR
	)`;
}

export async function down(sql) {
  await sql`DROP TABLE chocolates`;
}

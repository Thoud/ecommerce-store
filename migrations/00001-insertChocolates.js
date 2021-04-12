const chocolates = [
  {
    name: 'Dark Chocolate Espresso',
    description:
      'An invigorating combination of tart 70% cocoa chocolate and a robust espresso crème and coffee liqueur. The decorative element in real gold provides a hint of glamour and sparkle.',
    ingredients:
      'Cocoa mass, raw cane sugar, cream, cocoa butter, coffee liqueur, whole milk powder, glucose syrup, dye: gold; soluble coffee, coffee ground, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/espresso.png',
    url_path: 'dark-chocolate-espresso',
    stripe_id: 'price_1If8ZgFFx9jx2hSUs430R5kj',
    price: '1,82',
  },
  {
    name: 'Dark Chocolate Remy Martin',
    description:
      'The combination of 70% cocoa chocolate and a tart filling featuring Remy Martin and whipped cream results in a sophisticated flavour experience.',
    ingredients:
      'Cocoa mass, raw cane sugar, cream, cocoa butter, remy martin (3,63%), glucose syrup, whole milk powder, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/remy_martin.png',
    url_path: 'dark-chocolate-remy-martin',
    stripe_id: 'price_1If8aiFFx9jx2hSUsIomf298',
    price: '1,82',
  },
  {
    name: 'Dark Chocolate Cassis',
    description:
      'This creation featuring flavorful organic dark 70% cocoa chocolate and a fruity, sour cassis filling is a gift of harmonious indulgence.',
    ingredients:
      'Cocoa mass, raw cane sugar, cream, cocoa butter, whole milk powder, glucose syrup, blackcurrant juice concentrate (2,78%), vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/cassis.png',
    url_path: 'dark-chocolate-cassis',
    stripe_id: 'price_1If8bhFFx9jx2hSUKVI3z98d',
    price: '1,82',
  },
  {
    name: 'Dark Chocolate Pistachio-Marzipan',
    description:
      'A delicious creation of marzipan with pistachios, topped with 70% cocoa dark chocolate. The chocolate for marzipan lovers.',
    ingredients:
      'Almonds (26,4%), raw cane sugar, sugar, cocoa mass, pistachios (6,77%), invert sugar syrup, glucose syrup, cocoa butter, fruit puree, natural pistachio aroma(contains almond oil), vanilla',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/pistachio_marzipan.png',
    url_path: 'dark-chocolate-pistachio-marzipan',
    stripe_id: 'price_1If8ccFFx9jx2hSUzLk2L1rB',
    price: '1,34',
  },
  {
    name: 'Milk Chocolate Elderberry',
    description:
      'The fruity, tart flavour notes of the elderberry evolve as a fine cream in organic milk chocolate.',
    ingredients:
      'Raw cane sugar, cocoa butter, cream, whole milk powder, cocoa mass, currant powder, elderberry juice concentrate (4,96%), glucose syrup, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/elderberry.png',
    url_path: 'milk-chocolate-elderberry',
    stripe_id: 'price_1If8dHFFx9jx2hSUHNxf3CU3',
    price: '1,34',
  },
  {
    name: 'Milk Chocolate Hazelnut',
    description:
      'A delicate hazelnut cream blended with organic milk chocolate to create a delicious treat. Decorated with white organic chocolate and a roasted hazelnut.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, cocoa mass, hazelnuts (7,16%), glucose syrup, sugar, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/hazelnut.png',
    url_path: 'milk-chocolate-hazelnut',
    stripe_id: 'price_1If8dwFFx9jx2hSUKkcgoT6k',
    price: '1,34',
  },
  {
    name: 'Milk Chocolate Lemon-Basil',
    description:
      'Refreshing pleasure in delicate organic milk chocolate. A zesty lemon cream is enhanced with a sophisticated hint of basil.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, cocoa mass, glucose syrup, lemon juice concentrate (1,98%), lemon peel powder, basil (0,08%), vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/lemon_basil.png',
    url_path: 'milk-chocolate-lemon-basil',
    stripe_id: 'price_1If8ewFFx9jx2hSU6BHuPXW7',
    price: '1,82',
  },
  {
    name: 'White Chocolate Egg Liqueur',
    description:
      'A particularly creamy ganache with the finest organic egg liqueur, blended with organic white chocolate to create this delicious taste experience. Embellished with a sophisticated cocoa bean.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, eggnog (8,29%) (contains eggs, milk), glucose syrup, vanilla, emulsifier: lecithin',
    allergens: 'eggs, nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_liqueur.png',
    url_path: 'white-chocolate-egg-liqueur',
    stripe_id: 'price_1If8ffFFx9jx2hSUScMrQk6M',
    price: '1,82',
  },
  {
    name: 'White Chocolate Marc De Champagne-Rose',
    description:
      'White chocolate and a creamy-elegant Marc de Champagne ganache meet a hint of sophisticated rose oil. Dried rose petals enhance this romantic chocolate creation.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, glucose syrup, Marc de Champagne (2,47%), rose petals, vanilla, natural rose flavor (0,01%), emulsifier: lecithin',
    allergens: 'nuts, peanuts, milk, sulfites, lupins',
    img_path: '/champagne_rose.png',
    url_path: 'white-chocolate-marc-de-champagne-rose',
    stripe_id: 'price_1If8gOFFx9jx2hSUTd9vtlZA',
    price: '1,82',
  },
  {
    name: 'White Strawberry-Yoghurt',
    description:
      'This blend of organic white chocolate promises creamy, fruity indulgence. A light yoghurt cream, teamed with strawberries.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, glucose syrup, strawberry juice concentrate (3,23%), skimmed yogurt powder (1,62%), strawberries (0,76%), natural strawberry flavour (contains almond oil), vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/strawberry_yoghurt.png',
    url_path: 'white-strawberry-yoghurt',
    stripe_id: 'price_1If8hKFFx9jx2hSUu7iSxWcX',
    price: '1,34',
  },
  {
    name: 'Dark Chocolate Egg Orange Liqueur',
    description:
      'A high-percentage Easter delight: tart dark chocolate with 70% cocoa meets a fine cream with orange liqueur.',
    ingredients:
      'Cocoa mass, raw cane sugar, cream, cocoa butter, orange liqueur (4,16%), glucose syrup, whole milk powder, mandarin powder, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_orange_liqueur.png',
    url_path: 'dark-chocolate-egg-orange-liqueur',
    stripe_id: 'price_1If8iHFFx9jx2hSUyQoNiQPl',
    price: '1,95',
  },
  {
    name: 'Dark Chocolate Egg Raspberry-Chili',
    description:
      'Tart organic dark chocolate meets a creamy raspberry ganache, which is completed with a touch of chili.',
    ingredients:
      'Cocoa mass, raw cane sugar, cocoa butter, cream, whole milk powder, glucose syrup, raspberry juice concentrate (2,77%), raspberries (0,17%), chili, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_raspberry_chili.png',
    url_path: 'dark-chocolate-egg-raspberry-chili',
    stripe_id: 'price_1If8iuFFx9jx2hSUq1FtNQRq',
    price: '1,95',
  },
  {
    name: 'White Chocolate Egg Strawberry-Yoghurt',
    description:
      'White organic chocolate meets a fine strawberry yoghurt filling.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, glucose syrup, strawberry juice concentrate (2,49%), skimmed yoghurt powder (1,25%), raspberries, strawberries (0,25%), vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_strawberry_yogurt.png',
    url_path: 'white-chocolate-egg-strawberry-yoghurt',
    stripe_id: 'price_1If8jXFFx9jx2hSUfiGvvkUp',
    price: '1,95',
  },
  {
    name: 'White Chocolate Egg Nougat',
    description: 'Finest organic nougat coated in white organic chocolate.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, hazelnuts (9,50%), almonds (6,97%), cocoa mass, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_nougat.png',
    url_path: 'white-chocolate-egg-nougat',
    stripe_id: 'price_1If8kTFFx9jx2hSUx8cf3Xcd',
    price: '1,95',
  },
  {
    name: 'Milk Chocolate Egg Cranberry',
    description:
      'Tender organic milk chocolate meets a fruity cranberry ganache.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, cocoa mass, glucose syrup, cranberry juice concentrate (2,73%), turmeric, matcha powder, vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_cranberry.png',
    url_path: 'milk-chocolate-egg-cranberry',
    stripe_id: 'price_1If8lBFFx9jx2hSUmAqda6ue',
    price: '1,95',
  },
  {
    name: 'Milk Chocolate Egg Ginger-Tumeric',
    description:
      'The finest organic milk chocolate combines with ginger and turmeric to create an extraordinarily harmonious praline creation.',
    ingredients:
      'Raw cane sugar, cocoa butter, whole milk powder, cream, cocoa mass, glucose syrup, ginger (0,35%), natural ginger aroma (contains almond oil), turmeric (0,35%), vanilla, emulsifier: lecithin',
    allergens: 'Nuts, peanuts, milk, sulfites, lupins',
    img_path: '/egg_ginger_tumeric.png',
    url_path: 'milk-chocolate-egg-ginger-tumeric',
    stripe_id: 'price_1If8lrFFx9jx2hSUKw5pP3bz',
    price: '1,95',
  },
];

exports.up = async (sql) => {
  await sql`
		INSERT INTO chocolates
			${sql(
        chocolates,
        'name',
        'description',
        'ingredients',
        'allergens',
        'img_path',
        'url_path',
        'stripe_id',
        'price',
      )}
	`;
};

exports.down = async (sql) => {
  await sql`
		DELETE FROM chocolates
	`;
};

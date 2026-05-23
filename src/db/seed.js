import db from '../config/database.js';
import { cities, travelConnectors, hotels, attractions, attractionConnectors } from './schema/index.js';
import { config } from 'dotenv';

config();

async function seed() {
  console.log('Seeding database...');

  await db.delete(attractionConnectors);
  await db.delete(attractions);
  await db.delete(hotels);
  await db.delete(travelConnectors);
  await db.delete(cities);

  const cityData = await db
    .insert(cities)
    .values([
      { name: 'Dhaka', description: 'The bustling capital city of Bangladesh, known for its rich history, vibrant culture, and mouth-watering street food.' },
      { name: "Cox's Bazar", description: 'Home to the world\'s longest natural sea beach, stretching over 120 km along the Bay of Bengal.' },
      { name: 'Sylhet', description: 'Famous for its lush tea gardens, rolling hills, and the spiritual shrine of Hazrat Shah Jalal.' },
      { name: 'Bandarban', description: 'A hill district offering breathtaking mountain views, indigenous culture, and trekking adventures.' },
      { name: 'Rangamati', description: 'A scenic lake town in the Chittagong Hill Tracts, known for its picturesque landscapes and tribal heritage.' },
    ])
    .returning();

  const cityMap = {};
  for (const c of cityData) {
    cityMap[c.name] = c.id;
  }

  const connectorData = await db
    .insert(travelConnectors)
    .values([
      { city1Id: cityMap['Dhaka'], city2Id: cityMap["Cox's Bazar"], mode: 'Bus', timeInMinutes: 360 },
      { city1Id: cityMap['Dhaka'], city2Id: cityMap['Sylhet'], mode: 'Bus', timeInMinutes: 300 },
      { city1Id: cityMap['Dhaka'], city2Id: cityMap['Bandarban'], mode: 'Bus', timeInMinutes: 420 },
      { city1Id: cityMap['Dhaka'], city2Id: cityMap['Rangamati'], mode: 'Bus', timeInMinutes: 360 },
      { city1Id: cityMap["Cox's Bazar"], city2Id: cityMap['Bandarban'], mode: 'Car', timeInMinutes: 120 },
      { city1Id: cityMap['Sylhet'], city2Id: cityMap['Bandarban'], mode: 'Boat', timeInMinutes: 180 },
      { city1Id: cityMap['Rangamati'], city2Id: cityMap['Bandarban'], mode: 'Car', timeInMinutes: 90 },
    ])
    .returning();

  const hotelData = await db
    .insert(hotels)
    .values([
      { cityId: cityMap['Dhaka'], name: 'Hotel Pan Pacific Sonargaon', category: 'Luxury', price: 12000 },
      { cityId: cityMap['Dhaka'], name: 'The Westin Dhaka', category: 'Luxury', price: 15000 },
      { cityId: cityMap['Dhaka'], name: 'Shuktara Bed & Breakfast', category: 'Standard', price: 3000 },
      { cityId: cityMap["Cox's Bazar"], name: 'Sayeman Beach Resort', category: 'Premium', price: 8000 },
      { cityId: cityMap["Cox's Bazar"], name: 'Seagull Hotel', category: 'Standard', price: 4000 },
      { cityId: cityMap["Cox's Bazar"], name: 'Ocean Paradise Hotel', category: 'Premium', price: 7000 },
      { cityId: cityMap['Sylhet'], name: 'Grand Sultan Tea Resort', category: 'Luxury', price: 10000 },
      { cityId: cityMap['Sylhet'], name: 'Rose View Hotel', category: 'Standard', price: 3500 },
      { cityId: cityMap['Bandarban'], name: 'Hill View Guest House', category: 'Budget', price: 1500 },
      { cityId: cityMap['Bandarban'], name: 'Chimbuk Hill Resort', category: 'Standard', price: 3000 },
      { cityId: cityMap['Rangamati'], name: 'Parjatan Holiday Complex', category: 'Standard', price: 2500 },
      { cityId: cityMap['Rangamati'], name: 'Hotel Green Castle', category: 'Budget', price: 1800 },
    ])
    .returning();

  const attractionData = await db
    .insert(attractions)
    .values([
      { cityId: cityMap['Dhaka'], name: 'Lalbagh Fort', description: 'An incomplete Mughal fort complex with beautiful gardens and historical architecture.', lat: 23.7193, long: 90.3884, category: 'Historic', rating: 4.2, openingHours: '09:00-17:00', entryFee: 200, duration: '1-2 hours', imageUrl: 'https://example.com/lalbagh.jpg' },
      { cityId: cityMap['Dhaka'], name: 'Ahsan Manzil', description: 'The Pink Palace, a stunning riverside residence of the Dhaka Nawab family.', lat: 23.7081, long: 90.4081, category: 'Historic', rating: 4.3, openingHours: '09:00-17:00', entryFee: 150, duration: '1-2 hours', imageUrl: 'https://example.com/ahsan.jpg' },
      { cityId: cityMap["Cox's Bazar"], name: 'Cox\'s Bazar Beach', description: 'The world\'s longest natural sea beach, perfect for sunset views and swimming.', lat: 21.4272, long: 91.9711, category: 'Beach', rating: 4.6, openingHours: '00:00-23:59', entryFee: 0, duration: 'Full day', imageUrl: 'https://example.com/coxbeach.jpg' },
      { cityId: cityMap["Cox's Bazar"], name: 'Himchari National Park', description: 'A lush national park with waterfalls, wildlife, and panoramic sea views.', lat: 21.3500, long: 92.0167, category: 'Nature', rating: 4.4, openingHours: '08:00-18:00', entryFee: 100, duration: '2-3 hours', imageUrl: 'https://example.com/himchari.jpg' },
      { cityId: cityMap['Sylhet'], name: 'Ratargul Swamp Forest', description: 'A unique freshwater swamp forest accessible by boat, teeming with wildlife.', lat: 25.0333, long: 91.9500, category: 'Nature', rating: 4.5, openingHours: '08:00-17:00', entryFee: 150, duration: '2-3 hours', imageUrl: 'https://example.com/ratargul.jpg' },
      { cityId: cityMap['Sylhet'], name: 'Jaflong', description: 'A scenic area with crystal-clear rivers and views of the Khasi Hills.', lat: 25.1667, long: 92.0167, category: 'Nature', rating: 4.3, openingHours: '06:00-18:00', entryFee: 50, duration: '3-4 hours', imageUrl: 'https://example.com/jaflong.jpg' },
      { cityId: cityMap['Bandarban'], name: 'Nilgiri', description: 'One of the highest peaks in Bangladesh offering stunning sunrise views.', lat: 21.8333, long: 92.3667, category: 'Adventure', rating: 4.7, openingHours: '06:00-17:00', entryFee: 100, duration: 'Half day', imageUrl: 'https://example.com/nilgiri.jpg' },
      { cityId: cityMap['Bandarban'], name: 'Boga Lake', description: 'A mystical lake nestled in the hills, popular for trekking and camping.', lat: 21.9333, long: 92.5833, category: 'Adventure', rating: 4.6, openingHours: '06:00-17:00', entryFee: 50, duration: 'Full day', imageUrl: 'https://example.com/boga.jpg' },
      { cityId: cityMap['Rangamati'], name: 'Kaptai Lake', description: 'Bangladesh\'s largest man-made lake, ideal for boat rides and scenic views.', lat: 22.5000, long: 92.2167, category: 'Nature', rating: 4.4, openingHours: '06:00-18:00', entryFee: 50, duration: '3-4 hours', imageUrl: 'https://example.com/kaptai.jpg' },
      { cityId: cityMap['Rangamati'], name: 'Hanging Bridge', description: 'A pedestrian suspension bridge offering panoramic lake and hillside views.', lat: 22.6500, long: 92.1833, category: 'Adventure', rating: 4.2, openingHours: '08:00-20:00', entryFee: 20, duration: '30 min', imageUrl: 'https://example.com/hanging.jpg' },
    ])
    .returning();

  const hotelMap = {};
  for (const h of hotelData) {
    hotelMap[h.name] = h.id;
  }
  const attractionMap = {};
  for (const a of attractionData) {
    attractionMap[a.name] = a.id;
  }

  await db
    .insert(attractionConnectors)
    .values([
      { hotelId: hotelMap['Sayeman Beach Resort'], attractionId: attractionMap["Cox's Bazar Beach"], mode: 'Walk', time: 5 },
      { hotelId: hotelMap['Sayeman Beach Resort'], attractionId: attractionMap['Himchari National Park'], mode: 'Car', time: 15 },
      { hotelId: hotelMap['Seagull Hotel'], attractionId: attractionMap["Cox's Bazar Beach"], mode: 'Walk', time: 2 },
      { hotelId: hotelMap['Ocean Paradise Hotel'], attractionId: attractionMap["Cox's Bazar Beach"], mode: 'Walk', time: 3 },
      { hotelId: hotelMap['Grand Sultan Tea Resort'], attractionId: attractionMap['Ratargul Swamp Forest'], mode: 'Car', time: 60 },
      { hotelId: hotelMap['Grand Sultan Tea Resort'], attractionId: attractionMap['Jaflong'], mode: 'Car', time: 90 },
      { hotelId: hotelMap['Rose View Hotel'], attractionId: attractionMap['Ratargul Swamp Forest'], mode: 'Car', time: 50 },
      { hotelId: hotelMap['Hill View Guest House'], attractionId: attractionMap['Nilgiri'], mode: 'Car', time: 30 },
      { hotelId: hotelMap['Hill View Guest House'], attractionId: attractionMap['Boga Lake'], mode: 'Car', time: 60 },
      { hotelId: hotelMap['Chimbuk Hill Resort'], attractionId: attractionMap['Nilgiri'], mode: 'Car', time: 20 },
      { hotelId: hotelMap['Parjatan Holiday Complex'], attractionId: attractionMap['Kaptai Lake'], mode: 'Walk', time: 10 },
      { hotelId: hotelMap['Parjatan Holiday Complex'], attractionId: attractionMap['Hanging Bridge'], mode: 'Car', time: 15 },
      { hotelId: hotelMap['Hotel Green Castle'], attractionId: attractionMap['Kaptai Lake'], mode: 'Car', time: 5 },
      { hotelId: hotelMap['Hotel Pan Pacific Sonargaon'], attractionId: attractionMap['Lalbagh Fort'], mode: 'Car', time: 20 },
      { hotelId: hotelMap['Hotel Pan Pacific Sonargaon'], attractionId: attractionMap['Ahsan Manzil'], mode: 'Car', time: 15 },
    ]);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

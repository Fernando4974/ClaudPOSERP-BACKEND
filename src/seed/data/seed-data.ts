export interface SeedProduct {
  title: string;
  description: string;
  price: number;
  stock: number;
  categorie: string;
  barcode: string;
  posAvalible: boolean;
  tags: string[];
  images: string[];
  numberKey: number;
  user: string;
}

const userIds = [
  '7a682ae0-7790-47e3-9a18-39f3975b8629',
  'b147454c-1277-463f-a5e3-8422e22c17e2',
];

export const SEED_DATA: SeedProduct[] = [
  {
    title: 'Smartphone Galaxy Z5 Pro',
    description: 'Pantalla AMOLED de 6.7 pulgadas, 256GB de almacenamiento.',
    price: 899.0,
    stock: 15,
    categorie: 'technology',
    barcode: '7509876543210',
    posAvalible: true,
    tags: ['celular', 'tech', 'android'],
    images: ['phone_v1.png'],
    numberKey: 1,
    user: userIds[0],
  },
  {
    title: 'Laptop Pro 14 M3 Max',
    description: 'Procesador de última generación, 16GB RAM, SSD 512GB.',
    price: 1299.99,
    stock: 8,
    categorie: 'technology',
    barcode: '7501112223334',
    posAvalible: true,
    tags: ['laptop', 'computacion', 'apple'],
    images: ['laptop_m3.jpg'],
    numberKey: 2,
    user: userIds[1],
  },
  {
    title: 'Audífonos Noise Cancelling XM5',
    description: 'Cancelación de ruido activa y batería de 40 horas.',
    price: 199.5,
    stock: 25,
    categorie: 'technology',
    barcode: '7504445556667',
    posAvalible: true,
    tags: ['audio', 'bluetooth', 'musica'],
    images: ['headphones.jpg'],
    numberKey: 3,
    user: userIds[0],
  },
  {
    title: 'Monitor 4K 27 UltraSharp',
    description: 'Monitor profesional para diseño y gaming, panel IPS.',
    price: 349.0,
    stock: 10,
    categorie: 'technology',
    barcode: '7507778889990',
    posAvalible: true,
    tags: ['monitor', 'periferico', '4k'],
    images: ['monitor27.jpg'],
    numberKey: 4,
    user: userIds[1],
  },
  {
    title: 'Teclado Mecánico RGB Pro',
    description: 'Switches brown, retroiluminación personalizada.',
    price: 75.0,
    stock: 30,
    categorie: 'technology',
    barcode: '7501212121212',
    posAvalible: true,
    tags: ['gaming', 'teclado', 'setup'],
    images: ['keyboard_rgb.png'],
    numberKey: 5,
    user: userIds[0],
  },
];

const productNames = [
  'Mouse Inalámbrico',
  'Cámara Web',
  'Disco Duro',
  'Tablet Pro',
  'Smartwatch',
  'Sudadera Hoodie',
  'Jeans Slim',
  'Camiseta Básica',
  'Chaqueta Impermeable',
  'Tenis Runner',
  'Gorra Urban',
  'Cinturón Cuero',
  'Cafetera Goteo',
  'Licuadora Power',
  'Juego Sartenes',
  'Lámpara LED',
  'Aspiradora Robot',
];
const categories = ['technology', 'clothing', 'home', 'sports', 'food'];

for (let i = 6; i <= 50; i++) {
  SEED_DATA.push({
    title: `${productNames[i % productNames.length]} Ref-${i}`,
    description: `Descripción premium del producto número ${i}.`,
    price: Number((Math.random() * (100 - 10) + 10).toFixed(2)),
    stock: Math.floor(Math.random() * 50) + 5,
    categorie: categories[i % categories.length],
    barcode: `750${100000 + i}`,
    posAvalible: true,
    tags: ['stock', 'venta'],
    images: [`prod_img_${i}.jpg`],
    numberKey: i,
    user: userIds[i % 2],
  });
}

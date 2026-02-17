import { SeedProduct } from '../interfaces/seed.interfaces';

export const SEED_DATA: SeedProduct[] = [
  {
    title: 'Sudadera Hoodie Essential',
    description:
      'Sudadera de algodón orgánico con capucha y bolsillo tipo canguro.',
    price: 45.99,
    stock: 50,
    categorie: 'clothing',
    barcode: '7501234567890',
    posAvalible: true,
    tags: ['hoodie', 'ropa', 'invierno'],
    images: ['hoodie_front.jpg', 'hoodie_back.jpg'],
  },
  {
    title: 'Smartphone Galaxy Z5',
    description: 'Pantalla AMOLED de 6.7 pulgadas, 256GB de almacenamiento.',
    price: 899.0,
    stock: 15,
    categorie: 'technology',
    barcode: '7509876543210',
    posAvalible: true,
    tags: ['celular', 'tech', 'android'],
    images: ['phone_v1.png', 'phone_side.png'],
  },
  // ... Imagina 28 productos más siguiendo este patrón
];

// Generador rápido para completar los 30 para pruebas
for (let i = 1; i <= 28; i++) {
  SEED_DATA.push({
    title: `Producto de Prueba ${i}`,
    description: `Descripción detallada del producto número ${i} para testing.`,
    price: Math.floor(Math.random() * 100) + 10,
    stock: Math.floor(Math.random() * 50),
    categorie: i % 2 === 0 ? 'electronics' : 'home',
    barcode: `BAR-${1000 + i}`,
    posAvalible: true,
    tags: ['test', 'seed'],
    images: [`image_${i}.jpg`],
  });
}

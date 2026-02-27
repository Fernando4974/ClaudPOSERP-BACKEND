export interface SeedImage {
  url: string;
}

export interface SeedProduct {
  title: string;
  description: string;
  price: number;
  stock: number;
  categorie: string;
  barcode: string;
  posAvalible: boolean;
  tags: string[];
  images: string[]; // Simplificado para el seed
  numberKey: number;
}

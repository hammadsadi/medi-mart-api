export type TMedicine = {
  name: string;
  description: string;
  price: number;
  stock: number;
  prescriptionRequired: boolean;
  manufacturer: string;
  expiryDate: Date;
  category: string;
  symptoms: string[];
  imageUrl: string;
};
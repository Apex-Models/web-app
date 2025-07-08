export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string[];
  ObjectModelData: string;
  type: string;
  category: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

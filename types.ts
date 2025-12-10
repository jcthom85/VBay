export enum Category {
  Vehicles = 'Vehicles',
  Housing = 'Housing & Rentals',
  Furniture = 'Furniture',
  Electronics = 'Electronics',
  Outdoor = 'Outdoor & Marine',
  Clothing = 'Clothing & Accessories',
  Books = 'Books & Textbooks',
  Misc = 'Miscellaneous',
}

export interface User {
  id: string;
  name: string;
  department: string;
  email: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrls: string[]; // Changed from single imageUrl to array
  sellerId: string;
  sellerEmail: string;
  createdAt: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
}

export interface CartItem extends Listing {
  addedAt: number;
}
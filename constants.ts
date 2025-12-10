import { Category, Listing, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Dr. Jane Mariner',
  department: 'Fisheries Science',
  email: 'jane.m@vims.edu'
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: '2015 Honda Civic LX',
    description: 'Reliable commuter car, 85k miles. Clean title. Great for getting to and from campus. Recently inspected.',
    price: 12500.00,
    category: Category.Vehicles,
    imageUrls: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u2',
    sellerEmail: 'student.driver@vims.edu',
    createdAt: '2023-10-25T10:00:00Z',
    condition: 'Good'
  },
  {
    id: '2',
    title: 'Room for Rent - Gloucester Point',
    description: 'Master bedroom in a shared house, 5 mins from VIMS. $600/mo including utilities. Looking for a quiet grad student or staff.',
    price: 600.00,
    category: Category.Housing,
    imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u3',
    sellerEmail: 'landlord.staff@vims.edu',
    createdAt: '2023-10-26T14:30:00Z',
    condition: 'Good'
  },
  {
    id: '3',
    title: 'IKEA Sectional Sofa',
    description: 'Grey L-shaped sofa. About 2 years old. Must pick up, I cannot deliver.',
    price: 150.00,
    category: Category.Furniture,
    imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u1',
    sellerEmail: 'jane.m@vims.edu',
    createdAt: '2023-10-27T09:15:00Z',
    condition: 'Good'
  },
  {
    id: '4',
    title: 'Introduction to Physical Oceanography',
    description: 'Textbook by Knauss. Required for PO 101. Slight highlighting on first few chapters.',
    price: 30.00,
    category: Category.Books,
    imageUrls: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u4',
    sellerEmail: 'grad.student@vims.edu',
    createdAt: '2023-10-28T11:20:00Z',
    condition: 'Like New'
  },
  {
    id: '5',
    title: 'Ocean Kayak Malibu Two',
    description: 'Tandem sit-on-top kayak. Comes with two paddles. Great for the York River!',
    price: 350.00,
    category: Category.Outdoor,
    imageUrls: ['https://images.unsplash.com/photo-1541544537128-c4c090a93a38?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u5',
    sellerEmail: 'kayak.lover@vims.edu',
    createdAt: '2023-10-28T16:45:00Z',
    condition: 'Fair'
  },
  {
    id: 'test-item-1',
    title: 'Vintage VIMS Field Gear',
    description: 'Original field jacket from the 90s. Size Large. Perfect condition. Test item for email functionality.',
    price: 45.00,
    category: Category.Clothing,
    imageUrls: ['https://images.unsplash.com/photo-1551488852-d81a4d53e253?auto=format&fit=crop&w=800&q=80'],
    sellerId: 'u-test',
    sellerEmail: 'jcthomas@vims.edu',
    createdAt: '2023-11-01T09:00:00Z',
    condition: 'Like New'
  }
];
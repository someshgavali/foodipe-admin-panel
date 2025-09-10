export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Canteen {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  canteenId: string;
  canteenName: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Customer',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Customer',
    status: 'inactive',
    createdAt: '2024-01-05'
  }
];

export const mockCanteens: Canteen[] = [
  {
    id: '1',
    name: 'Main Campus Canteen',
    location: 'Building A, Floor 1',
    manager: 'Sarah Wilson',
    phone: '+1-234-567-8901',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Science Block Canteen',
    location: 'Science Building, Floor 2',
    manager: 'David Brown',
    phone: '+1-234-567-8902',
    status: 'active',
    createdAt: '2024-01-02'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Main Dishes',
    description: 'Primary meals and entrees',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Beverages',
    description: 'Hot and cold drinks',
    status: 'active',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Desserts',
    description: 'Sweet treats and desserts',
    status: 'active',
    createdAt: '2024-01-03'
  }
];

export const mockSubcategories: Subcategory[] = [
  {
    id: '1',
    name: 'Rice Dishes',
    description: 'Rice-based meals',
    categoryId: '1',
    categoryName: 'Main Dishes',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Noodles',
    description: 'Noodle-based dishes',
    categoryId: '1',
    categoryName: 'Main Dishes',
    status: 'active',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Hot Drinks',
    description: 'Coffee, tea, hot chocolate',
    categoryId: '2',
    categoryName: 'Beverages',
    status: 'active',
    createdAt: '2024-01-03'
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Fried Rice',
    description: 'Delicious fried rice with chicken and vegetables',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=300',
    categoryId: '1',
    categoryName: 'Main Dishes',
    subcategoryId: '1',
    subcategoryName: 'Rice Dishes',
    canteenId: '1',
    canteenName: 'Main Campus Canteen',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Beef Noodle Soup',
    description: 'Hearty soup with beef and noodles',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300',
    categoryId: '1',
    categoryName: 'Main Dishes',
    subcategoryId: '2',
    subcategoryName: 'Noodles',
    canteenId: '1',
    canteenName: 'Main Campus Canteen',
    status: 'active',
    createdAt: '2024-01-02'
  }
];
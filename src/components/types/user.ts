export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type CartItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string[];
    selectedColor?: string;
    selectedOptions?: { [key: string]: string };
};

export interface UserContextType {
    user: User | null;
    cart: CartItem[];
    login: (data: User) => void;
    logout: () => void;
    addToCart: (data: CartItem) => void;
}
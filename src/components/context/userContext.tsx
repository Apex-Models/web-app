import { createContext, useEffect, useState, ReactNode } from "react";
import { CartItem, User, UserContextType } from "../types/user";

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  cart: [],
  addToCart: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const checkAuth = async () => {
    const response = await fetch('http://localhost:4003/api/auth/me', {
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data?.success === false) {
      setUser(null);
      return;
    } else if (data?.data?.id && data?.data?.email && data?.data?.firstName && data?.data?.lastName) {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
  };

  const checkCart = async () => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(currentCart) {
      setCart(currentCart)
    }
    // try {
    //     const response = await fetch('http://localhost:3030/api/cart/me', {
    //         credentials: 'include'
    //     });
    //     const data = await response.json();
    //     setCart(data.cart);
    // } catch (error) {
    //     console.error('Erreur de vérification du panier:', error);
    //     setCart(null);
    // }
  };

  const addToCart = (data: CartItem) => {
    const updatedCart = [...cart, data];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   credentials: 'include'
    // });
  }
        
  const login = (data: User) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4003'}/api/auth/logout`, {
        credentials: 'include'
      });
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    checkCart();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, cart, addToCart }}>
      { children }
    </UserContext.Provider>
  )
}

export default UserContext;
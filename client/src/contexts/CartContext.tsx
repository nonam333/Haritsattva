import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number; // Price per kg
  imageUrl: string;
  quantity: number;
  weight: number; // Weight in kg (0.1, 0.25, 0.5, 1, 2)
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateWeight: (cartItemId: string, weight: number) => void;
  clearCart: () => void;
  totalItems: number;
  total: number; // Add total to the interface
  getCartItemId: (productId: string, weight: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Generate unique cart item ID based on product ID and weight
  const getCartItemId = (productId: string, weight: number) => {
    return `${productId}-${weight}`;
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const cartItemId = getCartItemId(item.id, item.weight);
      const existingItem = prevItems.find((i) => getCartItemId(i.id.split('-')[0], i.weight) === cartItemId);

      if (existingItem) {
        return prevItems.map((i) =>
          getCartItemId(i.id.split('-')[0], i.weight) === cartItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { ...item, id: cartItemId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const updateWeight = (cartItemId: string, weight: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, weight } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate the total price (price per kg * weight * quantity)
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.weight * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateWeight,
        clearCart,
        totalItems,
        total, // Provide total in the context
        getCartItemId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

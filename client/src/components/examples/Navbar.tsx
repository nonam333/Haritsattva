import Navbar from '../Navbar';
import { CartProvider } from '@/contexts/CartContext';

export default function NavbarExample() {
  return (
    <CartProvider>
      <Navbar />
    </CartProvider>
  );
}

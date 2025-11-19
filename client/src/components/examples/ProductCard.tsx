import ProductCard from '../ProductCard';
import avocadoImage from "@assets/generated_images/Halved_avocado_product_8a3a377a.png";
import { CartProvider } from '@/contexts/CartContext';

export default function ProductCardExample() {
  return (
    <CartProvider>
      <div className="max-w-xs">
        <ProductCard
          id="1"
          name="Avocado"
          price={85.00}
          imageUrl={avocadoImage}
        />
      </div>
    </CartProvider>
  );
}

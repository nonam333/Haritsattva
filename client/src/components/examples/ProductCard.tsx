import ProductCard from '../ProductCard';
import avocadoImage from "@assets/generated_images/Halved_avocado_product_8a3a377a.png";

export default function ProductCardExample() {
  return (
    <div className="max-w-xs">
      <ProductCard
        id="1"
        name="Avocado"
        price={2.99}
        imageUrl={avocadoImage}
        onAddToCart={() => console.log('Added to cart')}
      />
    </div>
  );
}

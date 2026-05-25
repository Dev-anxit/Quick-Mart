import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import type { ProductResponse } from '../../types/api';

interface ProductCardProps {
  product: ProductResponse;
  onCartOpen?: () => void;
}

export function ProductCard({ product, onCartOpen }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const { isLoggedIn } = useAuth();
  const { setAuthModalOpen, addToast } = useUIStore();
  const productId = product._id || product.id || '';
  const existing = items.find(i => i.product_id === productId);
  const qty = existing?.quantity ?? 0;

  const [imgError, setImgError] = useState(false);

  const discount = product.discount_percentage || 0;
  const finalPrice = Math.round(product.price * (1 - discount / 100));
  const imageUrl = product.image_url || (product.image_urls?.length ? product.image_urls[0] : undefined);

  const handleAdd = () => {
    if (!isLoggedIn) {
      addToast({ type: 'info', message: 'Please login to add items to your cart' });
      setAuthModalOpen(true);
      return;
    }
    addItem({
      product_id: productId,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image_url: imageUrl,
    });
    onCartOpen?.();
  };

  const handleInc = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      addToast({ type: 'info', message: 'Please login to add items to your cart' });
      setAuthModalOpen(true);
      return;
    }
    if (qty >= product.stock) return;
    updateQuantity(productId, qty + 1);
  };

  const handleDec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      addToast({ type: 'info', message: 'Please login to add items to your cart' });
      setAuthModalOpen(true);
      return;
    }
    updateQuantity(productId, qty - 1);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-no-img">
            🛒<span>No Image</span>
          </div>
        )}

        {discount > 0 && (
          <div className="product-discount-badge">{discount}% OFF</div>
        )}

        <div className={`product-veg-dot ${product.veg_nonveg === 'veg' ? 'veg' : 'nonveg'}`} title={product.veg_nonveg} />
      </div>

      <div className="product-body">
        <div className="product-eta">⚡ 10 MINS</div>
        <h3 className="product-name">{product.name}</h3>
        {product.weight && <p className="product-weight">{product.weight}</p>}

        <div className="product-footer">
          <div className="product-price-wrap">
            <span className="product-price">₹{finalPrice}</span>
            {discount > 0 && (
              <span className="product-original-price">₹{product.price}</span>
            )}
          </div>

          {product.stock <= 0 ? (
            <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>OUT OF STOCK</span>
          ) : qty === 0 ? (
            <button className="btn-add" onClick={handleAdd}>ADD</button>
          ) : (
            <div className="qty-control" onClick={e => e.stopPropagation()}>
              <button className="qty-btn" onClick={handleDec}>−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={handleInc}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

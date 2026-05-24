import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import productService from '../services/productService';
import type { ProductResponse } from '../types/api';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCartStore();
  const { addToast } = useUIStore();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);

        // Fetch related products
        const categoryId = data.category_id || data.category || '';
        const related = await productService.getProducts({
          category: categoryId || undefined,
          limit: 6,
        });
        const products = related.data || [];
        const productId = data._id || data.id || '';
        setRelatedProducts(products.filter((p: any) => {
          const pId = p._id || p.id || '';
          return pId !== productId;
        }) || []);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        addToast({ type: 'error', message: 'Failed to load product' });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isLoggedIn, navigate, addToast]);

  const handleAddToCart = () => {
    if (!product) return;

    const productId = product._id || product.id || '';
    if (!productId) {
      addToast({ type: 'error', message: 'Product ID not found' });
      return;
    }

    addItem({
      product_id: productId,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });

    addToast({
      type: 'success',
      message: `Added ${quantity} ${product.name} to cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const discount = product.discount_percentage || 0;
  const finalPrice = product.price * (1 - discount / 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden h-96 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>No image</p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-600 mt-1">Brand: {product.brand}</p>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="font-semibold text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{finalPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-semibold">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Weight/Size */}
            {product.weight && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  <strong>Weight/Size:</strong> {product.weight}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 py-2 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg disabled:opacity-50 transition text-lg"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((prod) => (
                <button
                  key={prod._id}
                  onClick={() => navigate(`/product/${prod._id}`)}
                  className="bg-white rounded-lg p-4 hover:shadow-lg transition text-left"
                >
                  <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {prod.image_url ? (
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {prod.name}
                  </p>
                  <p className="text-sm font-bold text-violet-600 mt-2">
                    ₹{(prod.price * (1 - (prod.discount_percentage || 0) / 100)).toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

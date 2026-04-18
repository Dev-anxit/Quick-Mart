import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import productService from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import type { ProductResponse, CategoryResponse } from '../types/api';

export default function Listing() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('');
  const [page, setPage] = useState(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (isLoggedIn) {
      fetchCategories();
    }
  }, [isLoggedIn]);

  // Fetch products with current filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getProducts({
          category: selectedCategory || undefined,
          price_min: priceMin,
          price_max: priceMax,
          sort: sortBy || undefined,
          page,
          limit: 24,
        });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn, selectedCategory, priceMin, priceMax, sortBy, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 font-syne mb-6">Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="font-bold text-gray-900 mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-600"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceMin}
                  onChange={(e) => {
                    setPriceMin(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => {
                      setPriceMin(parseInt(e.target.value) || 0);
                      setPage(1);
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => {
                      setPriceMax(parseInt(e.target.value) || 1000);
                      setPage(1);
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-600"
              >
                <option value="">Relevance</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Rating</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSelectedCategory('');
                setPriceMin(0);
                setPriceMax(1000);
                setSortBy('');
                setPage(1);
              }}
              className="w-full bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Main Content - Products */}
          <div className="md:col-span-3">
            {/* Results Info */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length > 0 ? (page - 1) * 24 + 1 : 0} -{' '}
              {page * 24} products
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && products.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-900">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={products.length < 24}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

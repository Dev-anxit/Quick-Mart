import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import productService from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import type { ProductResponse } from '../types/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search on query param change
  useEffect(() => {
    if (!query || !isLoggedIn) return;

    const performSearch = async () => {
      try {
        setIsLoading(true);
        const data = await productService.searchProducts(query, 50);
        setResults(data || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, isLoggedIn]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setSearchParams({ q: searchInput });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 font-syne mb-8">Search Products</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products, brands, or categories..."
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-600 focus:outline-none text-lg"
              autoFocus
            />
            <button
              type="submit"
              className="bg-violet-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-violet-700 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "
                <strong>{query}</strong>"
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-600 text-lg">
                No products found for "<strong>{query}</strong>"
              </p>
              <p className="text-gray-500 text-sm mt-2">Try different keywords</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-4xl mb-3">🛍️</div>
            <p className="text-gray-600 text-lg">Enter a search query to find products</p>
          </div>
        )}
      </div>
    </div>
  );
}

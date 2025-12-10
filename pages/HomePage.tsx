import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Listing, Category } from '../types';
import { ListingCard } from '../components/ListingCard';

interface HomePageProps {
  listings: Listing[];
  searchQuery: string;
  onAddToCart: (item: Listing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ listings, searchQuery, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'none'>('none');

  const categories = ['All', ...Object.values(Category)];
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Condition
    if (selectedCondition !== 'All') {
      result = result.filter(item => item.condition === selectedCondition);
    }

    // Sort by Price
    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default to newest first (using createdAt string comparison is safe for ISO dates)
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return result;
  }, [listings, searchQuery, selectedCategory, selectedCondition, priceSort]);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            The VIMS Marketplace
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Trusted buy & sell for VIMS faculty, staff, and students.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100 font-semibold border-b border-slate-100 dark:border-slate-700 pb-3">
                <SlidersHorizontal className="h-5 w-5" />
                <h2>Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">Categories</h3>
                <ul className="space-y-1">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-md transition-all ${
                          selectedCategory === cat
                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Condition Filter */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">Condition</h3>
                <ul className="space-y-2">
                  {conditions.map(cond => (
                    <li key={cond} className="flex items-center">
                       <input 
                         type="radio" 
                         id={`cond-${cond}`} 
                         name="condition" 
                         checked={selectedCondition === cond}
                         onChange={() => setSelectedCondition(cond)}
                         className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                       />
                       <label 
                         htmlFor={`cond-${cond}`}
                         className="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                       >
                         {cond}
                       </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header: Title & Sort */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {selectedCategory === 'All' ? 'Latest Listings' : selectedCategory}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {filteredListings.length} results
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort by:</span>
                 <div className="relative w-full sm:w-48">
                    <select
                      value={priceSort}
                      onChange={(e) => setPriceSort(e.target.value as any)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="none">Newest Listed</option>
                      <option value="asc">Price: Low to High</option>
                      <option value="desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                 </div>
              </div>
            </div>

            {/* Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                <Filter className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">No listings found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All'); 
                    setSelectedCondition('All');
                    setPriceSort('none');
                  }}
                  className="mt-4 text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
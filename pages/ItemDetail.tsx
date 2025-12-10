import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Calendar, User as UserIcon, Edit } from 'lucide-react';
import { Listing, User } from '../types';

interface ItemDetailProps {
  listings: Listing[];
  onAddToCart: (item: Listing) => void;
  currentUser: User | null;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ listings, onAddToCart, currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const item = listings.find(l => l.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Item not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
      </div>
    );
  }

  const isSeller = currentUser && currentUser.id === item.sellerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </button>

        {isSeller && (
          <button
            onClick={() => navigate(`/edit/${item.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors border border-slate-300"
          >
            <Edit className="h-4 w-4" />
            Edit Listing
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Image Section */}
          <div className="bg-slate-100 flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-video lg:h-96 w-full">
              <img 
                src={item.imageUrls[activeImageIndex]} 
                alt={item.title} 
                className="w-full h-full object-contain bg-slate-900"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-semibold text-slate-800 shadow-sm">
                {item.category}
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            {item.imageUrls.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50 border-t border-slate-200">
                {item.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-blue-600 ring-2 ring-blue-100' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                item.condition === 'New' || item.condition === 'Like New' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.condition}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>Seller ID: {item.sellerId}</span>
              </div>
            </div>

            <div className="prose prose-slate mb-8 flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-sm text-slate-500">Current Price</span>
                  <span className="text-3xl font-bold text-slate-900">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <ShieldCheck className="h-5 w-5" />
                  <span>VBay Buyer Protection</span>
                </div>
              </div>

              {!isSeller ? (
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-500 py-3 px-6 rounded-lg font-bold text-lg cursor-not-allowed"
                >
                  You own this item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onAddToCart: (item: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/item/${listing.id}`} className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={listing.imageUrls[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700 shadow-sm">
          {listing.condition}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {listing.category}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <Link to={`/item/${listing.id}`} className="block">
          <h3 className="text-lg font-semibold text-slate-800 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span className="text-xl font-bold text-slate-900">
            ${listing.price.toFixed(2)}
          </span>
          
          <div className="flex gap-2">
            <Link 
              to={`/item/${listing.id}`}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <button
              onClick={() => onAddToCart(listing)}
              className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SellItem } from './pages/SellItem';
import { ItemDetail } from './pages/ItemDetail';
import { LoginPage } from './pages/LoginPage';
import { INITIAL_LISTINGS, MOCK_USER } from './constants';
import { Listing, CartItem, User } from './types';
import { Mail } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ user }: { user: User | null }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  // --- State Management ---
  
  // User Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('vbay_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to load user from storage", e);
      return null;
    }
  });

  // Listings State
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('vbay_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch (e) {
      console.error("Failed to load listings from storage", e);
      return INITIAL_LISTINGS;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vbay_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // --- Effects ---
  useEffect(() => {
    try {
      localStorage.setItem('vbay_listings', JSON.stringify(listings));
    } catch (e) {
      console.error("LocalStorage quota exceeded!", e);
      alert("Storage limit reached! Old items might not be saved or new items might fail to persist.");
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('vbay_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('vbay_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('vbay_user');
      }
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  }, [currentUser]);

  // --- Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]); // Optional: clear cart on logout
  };

  const handleAddItem = (newItem: Listing) => {
    setListings(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: Listing) => {
    setListings(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    // Also update cart items if they match (to show new images/prices in cart)
    setCart(prev => prev.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, addedAt: item.addedAt } : item
    ));
  };

  const handleAddToCart = (item: Listing) => {
    if (!currentUser) {
      const confirmLogin = window.confirm("You must be logged in to add items to your cart. Proceed to login?");
      if (confirmLogin) {
        return; // The Navigate in ProtectedRoute logic doesn't apply here since we are on public page. 
        // We could redirect manually but alert is fine for now.
      }
      return;
    }
    
    setCart(prev => {
      if (prev.some(cartItem => cartItem.id === item.id)) {
        alert("Item is already in your cart!");
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
    alert(`Added "${item.title}" to cart!`);
  };

  const handleContactSeller = (item: CartItem) => {
    const subject = `VBay Inquiry: ${item.title}`;
    const body = `Hi,\n\nI found your listing for "${item.title}" on VBay and I am interested in purchasing it.\n\nIs it still available?\n\nThanks,\n${currentUser?.name}`;
    const mailtoLink = `mailto:${item.sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleContactAllSellers = () => {
    if (cart.length === 0) return;
    
    const emails = Array.from(new Set(cart.map(item => item.sellerEmail))).join(',');
    const subject = `VBay Inquiries`;
    const body = `Hi,\n\nI am interested in several items you have listed on VBay.`;
    
    window.location.href = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Simple Cart Page
  const CartPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Your Cart ({cart.length})</h1>
      {cart.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 gap-4">
              <div className="flex items-center gap-4 flex-1">
                <img src={item.imageUrls[0]} alt={item.title} className="w-16 h-16 object-cover rounded bg-slate-100 dark:bg-slate-900" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-teal-600 dark:text-teal-400 font-bold">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Seller: {item.sellerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleContactSeller(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-sm font-medium transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contact Seller
                </button>
                <button 
                  onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                  className="text-red-500 text-sm hover:underline px-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 pt-4 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row justify-end items-center gap-4">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            {cart.length > 1 && (
              <button 
                onClick={handleContactAllSellers}
                className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
              >
                Email All Sellers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <Navbar 
          cartCount={cart.length} 
          onSearch={setSearchQuery} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <HomePage 
                  listings={listings} 
                  searchQuery={searchQuery}
                  onAddToCart={handleAddToCart}
                />
              } 
            />
             <Route 
              path="/login" 
              element={<LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/item/:id" 
              element={
                <ItemDetail 
                  listings={listings}
                  onAddToCart={handleAddToCart}
                  currentUser={currentUser}
                />
              } 
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={currentUser} />}>
              <Route 
                path="/sell" 
                element={
                  <SellItem 
                    currentUser={currentUser!} 
                    listings={listings}
                    onAddItem={handleAddItem}
                    onUpdateItem={handleUpdateItem} 
                  />
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <SellItem 
                    currentUser={currentUser!} 
                    listings={listings}
                    onAddItem={handleAddItem} 
                    onUpdateItem={handleUpdateItem} 
                  />
                } 
              />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-2 font-semibold text-slate-200">VBay - VIMS Community Marketplace</p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Virginia Institute of Marine Science. 
              <br/>
              Not officially affiliated with VIMS IT. Use at your own risk.
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
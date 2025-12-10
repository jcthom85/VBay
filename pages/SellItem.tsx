import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, DollarSign, Tag, FileText, Image as ImageIcon, X, Plus, Save } from 'lucide-react';
import { Category, Listing, User } from '../types';

interface SellItemProps {
  currentUser: User;
  listings: Listing[]; // Needed to find item for editing
  onAddItem: (item: Listing) => void;
  onUpdateItem: (item: Listing) => void;
}

// Helper to resize and compress images
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           reject(new Error("Canvas context not available"));
           return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const SellItem: React.FC<SellItemProps> = ({ currentUser, listings, onAddItem, onUpdateItem }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Check for ID param to determine Edit mode
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: Category.Misc,
    condition: 'Good' as Listing['condition'],
    imageUrls: [] as string[]
  });

  // Load existing data if in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      const itemToEdit = listings.find(l => l.id === id);
      
      if (!itemToEdit) {
        alert("Item not found");
        navigate('/');
        return;
      }

      // Security check: Only allow owner to edit
      if (itemToEdit.sellerId !== currentUser.id) {
        alert("You do not have permission to edit this item.");
        navigate('/');
        return;
      }

      setFormData({
        title: itemToEdit.title,
        description: itemToEdit.description,
        price: itemToEdit.price.toString(),
        category: itemToEdit.category,
        condition: itemToEdit.condition,
        imageUrls: itemToEdit.imageUrls
      });
    }
  }, [id, isEditMode, listings, currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const resizedImage = await resizeImage(file);
      setFormData(prev => {
        if (prev.imageUrls.length >= 5) return prev;
        return {
          ...prev,
          imageUrls: [...prev.imageUrls, resizedImage]
        };
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 5 - formData.imageUrls.length;
      Array.from(files).slice(0, remainingSlots).forEach(processFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const remainingSlots = 5 - formData.imageUrls.length;
      Array.from(e.dataTransfer.files).slice(0, remainingSlots).forEach(processFile);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one image of the item.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        if (isEditMode && id) {
          // Update existing item
          const updatedItem: Listing = {
            ...listings.find(l => l.id === id)!, // preserve original ID and dates
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            imageUrls: formData.imageUrls,
            condition: formData.condition
            // sellerId, sellerEmail, createdAt remain unchanged
          };
          onUpdateItem(updatedItem);
          navigate(`/item/${id}`);
        } else {
          // Create new item
          const newItem: Listing = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            imageUrls: formData.imageUrls,
            sellerId: currentUser.id,
            sellerEmail: currentUser.email,
            createdAt: new Date().toISOString(),
            condition: formData.condition
          };
          onAddItem(newItem);
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while saving. Your images might be too large.");
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isEditMode ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {isEditMode ? 'Update details for your item.' : `Selling as ${currentUser.name}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 2018 Toyota Camry"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about what you are selling..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Item Images (Up to 5)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 group">
                  <img 
                    src={url} 
                    alt={`Upload ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {formData.imageUrls.length < 5 && (
                <div 
                  className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    dragActive 
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                      : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                   <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Plus className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add Photo</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag and drop or click to upload. Images will be automatically optimized.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
             <button
              type="button"
              onClick={() => navigate(isEditMode ? `/item/${id}` : '/')}
              className="mr-4 px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {isEditMode ? 'Updating...' : 'Posting...'}
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {isEditMode ? 'Update Listing' : 'Post Listing'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

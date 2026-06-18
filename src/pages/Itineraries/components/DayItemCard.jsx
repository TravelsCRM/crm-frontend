import React, { useState } from 'react';
import { GripVertical, Trash2, Upload, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../../services/uploadService';

export default function DayItemCard({ index, register, setValue, watch, remove, hotels, allActivities }) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Watch the image field value
  const imageUrl = watch(`days.${index}.image`);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      setValue(`days.${index}.image`, res.url);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue(`days.${index}.image`, '');
  };

  // Helper to format local asset URLs dynamically based on current host
  const getBackendUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
    const host = apiBase.replace(/\/api$/, '');
    return `${host}${path}`;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <GripVertical className="h-5 w-5 text-gray-400 mr-3 cursor-move flex-shrink-0" />
          <span className="text-lg font-bold text-primary-700 mr-4 font-mono flex-shrink-0">Day {index + 1}</span>
          <input 
            type="text" 
            {...register(`days.${index}.title`, { required: true })} 
            className="bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-900 p-0 w-full focus:outline-none" 
            placeholder="Title (e.g. Arrival and Beach Dinner)"
          />
        </div>
        <button 
          type="button" 
          onClick={() => remove(index)}
          className="text-gray-400 hover:text-red-600 ml-4 flex-shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            {...register(`days.${index}.description`)} 
            rows={3} 
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
            placeholder="What happens on this day?"
          />
        </div>
        
        {/* Day Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-[11px] uppercase font-bold tracking-wider">Day Photo / Image</label>
          <input type="hidden" {...register(`days.${index}.image`)} />
          
          {imageUrl ? (
            <div className="relative w-full max-w-sm rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
              <img 
                src={getBackendUrl(imageUrl)} 
                alt={`Day ${index + 1}`} 
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-md focus:outline-none"
                title="Remove Photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-[10px] text-gray-500 mt-1 font-semibold">Upload Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={isUploading}
                  className="hidden" 
                />
              </label>
              <div className="text-xs text-gray-400">
                Supports JPG, PNG, WEBP. Max size 5MB.
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Accommodation</label>
            <select 
              {...register(`days.${index}.hotel`)} 
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
            >
              <option value="">Select Hotel (or leave for custom)</option>
              {hotels?.map(h => <option key={h._id} value={h._id}>{h.name} ({h.rating})</option>)}
            </select>
            <input 
              type="text" 
              {...register(`days.${index}.hotelCustom`)} 
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic py-2 px-3 focus:outline-none"
              placeholder="Or enter custom hotel name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Transfers</label>
            <input 
              type="text" 
              {...register(`days.${index}.transfers`)} 
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
              placeholder="Pick up, drop, flights etc"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Activities</label>
            <select 
              {...register(`days.${index}.activities`)} 
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
            >
              <option value="">Select Activity</option>
              {allActivities?.map(a => <option key={a._id} value={a.name}>{a.name} (₹{a.basePrice})</option>)}
            </select>
            <input 
              type="text" 
              {...register(`days.${index}.activitiesCustom`)} 
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic py-2 px-3 focus:outline-none"
              placeholder="Or enter custom activities..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-[11px] uppercase font-bold tracking-wider">Meals Included</label>
            <div className="flex space-x-4 mt-1">
              <label className="inline-flex items-center">
                <input type="checkbox" {...register(`days.${index}.meals.breakfast`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-700">Breakfast</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" {...register(`days.${index}.meals.lunch`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-700">Lunch</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" {...register(`days.${index}.meals.dinner`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-700">Dinner</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider text-gray-400">Notes for this day</label>
          <input 
            type="text" 
            {...register(`days.${index}.notes`)} 
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic py-2 px-3 focus:outline-none"
            placeholder="Additional notes..."
          />
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { User } from '@/types';

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiNkMWQxZDE7Ii8+PHBhdGggZD0ibTE3Mi4zMiwxOTYuNjVjMC0yMS4wNy0uMDMtNDIuMTUsMC02My4yMiwwLTYuNDItMi4zOC0xMS4zNi03LjY3LTE0LjY2LTE0LjI3LTguOS0yOS4yOS0xNi4yMS00NS41MS0yMC42Ni0xMS4wNy0zLjAzLTIyLjQtMy4xLTMzLjY5LTEuMTMtMTUuNzcsMi43Ni0zMC41OCw4LjQ3LTQ0LjE2LDE3LjU2LTYuMTgsMy44NC04Ljk2LDguOTktOC45MiwxNi4yMS4wOSwyMS45NS4wMyw0My45LjAzLDY1Ljg1LDAsLjc2LjA2LDEuNTIuMSwyLjQ1Ljk3LjEyLDEuNzguMjksMi41OS4yOS00Mi40Ny4wMS04NC45My4wMS0xMjcuNC4wMS0uODIsMC0xLjY0LS4xNi0yLjYtLjI2LS4wNC0uNzktLjEyLTEuNDItLjEyLTIuMDUsMC0yMi4zMi0uMDMtNDQuNjQuMDItNjYuOTYsMC01LjE0LDIuMTQtOS4xNCw2LjIyLTEyLjI2LDUuOTYtNC41NywxMi41NS04LjE5LDE5LjI0LTExLjYsMTkuNzMtMTAuMDcsNDAuOTEtMTUuNzQsNjMuMzctMTUuNzMsMjIuNDYsMCw0My42NCw1LjY2LDYzLjM3LDE1LjczLDYuNjksMy40MSwxMy4yOSw3LjAzLDE5LjI0LDExLjYsNC4wOCwzLjEyLDYuMjIsNy4xMiw2LjIyLDEyLjI2LjA1LDIyLjMyLjAyLDQ0LjY0LjAyLDY2Ljk2LDAsLjYzLS4wOCwxLjI2LS4xMywyLjA1LS45Mi4wOS0xLjY5LjIzLTIuNDYuMjMtMTQuMTUsMC0yOC4zLDAtNDIuNDUsMFoiIHN0eWxlPSJmaWxsOiM5YjliOWI7Ii8+PHBhdGggZD0ibTExNS41LDE0MC44MmMtMjEuNiwwLTM5LjEzLTE3LjU0LTM5LjEyLTM5LjE0LDAtMjEuNTcsMTcuNTQtMzkuMSwzOS4xNi0zOS4wOSwyMS41OCwwLDM5LjA5LDE3LjUxLDM5LjA9LDM5LjEsMCwyMS42MS0xNy41MSwzOS4xMy0zOS4xMywzOS4xM1oiIHN0eWxlPSJmaWxsOiM5YjliOWI7Ii8+PC9zdmc+';

interface ProfileSummaryProps {
  user: User;
  onUpdateImage?: (file: File) => void;
  onRemoveImage?: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ 
  user, 
  onUpdateImage,
  onRemoveImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpdateImage) {
      onUpdateImage(e.target.files[0]);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!user) {
    return null;
  }

  const imageUrl = imageError || !user.profile_image 
    ? DEFAULT_AVATAR
    : `/storage/${user.profile_image}`;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-md shadow mb-6">
      <div className="relative group">
        <img
          src={imageUrl}
          alt={`${user.name}'s profile`}
          className="w-20 h-20 object-cover rounded-full bg-gray-200"
          onError={handleImageError}
        />
        {(onUpdateImage || onRemoveImage) && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-black rounded-full opacity-50"></div>
            <div className="relative z-10 flex space-x-2">
              {onUpdateImage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                  title="Upload new image"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}
              {onRemoveImage && user.profile_image && (
                <button
                  onClick={onRemoveImage}
                  className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
        <p className="text-sm text-gray-500">Edit your profile information below.</p>
      </div>
    </div>
  );
};

export default ProfileSummary;
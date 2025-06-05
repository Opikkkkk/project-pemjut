import React from 'react';

interface ProfileSummaryProps {
  name: string;
  profileImage?: string; // base64 atau URL
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ name, profileImage }) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-md shadow mb-6">
      <img
        src={profileImage || '/images/opik.png'}
        alt="Profile"
        className="w-20 h-20 object-cover bg-gray-200"
      />
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">Edit your profile information below.</p>
      </div>
    </div>
  );
};

export default ProfileSummary;

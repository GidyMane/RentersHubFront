"use client"
import React, { useState } from 'react';
import { Profile } from '@/components/Profile';

function Page() {
  // Example user data
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    profilePicture: '', // You can provide a URL to the profile picture here
  });

  // Define onEdit function
  const handleEdit = () => {
    console.log('Edit button clicked');
    // Implement edit functionality here (e.g., opening a modal to edit the profile)
  };

  return (
    <div>
      <Profile user={user} onEdit={handleEdit} />
    </div>
  );
}

export default Page;

import { fetchPropertyById } from '@/actions/fetchproperties';
import { getSimilarPropertyById } from '@/actions/property';
import PropertyDetail from '@/components/propertydetails';
import { Loader } from 'lucide-react';
import React, { Suspense } from 'react';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params if it's a promise
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return <p>Error: Invalid property ID</p>; // Handle invalid values safely
  }

  const [property, similarProperties] = await Promise.all([
    fetchPropertyById(numericId),
    getSimilarPropertyById(numericId),
  ]);

  console.log(property, "on the page");

  return (
    <div className="w-full min-h-[50vh]">
      <div className="mt-20">
        <Suspense fallback={<Loader className="animate animate-spin text-secondary400" />}>
          <PropertyDetail property={property} similarproperties={similarProperties} />
        </Suspense>
      </div>
    </div>
  );
}

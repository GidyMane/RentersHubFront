
import { getPropertyById, getSimilarPropertyById } from '@/actions/property';
import PropertyDetail from '@/components/propertydetails';
import { Loader } from 'lucide-react';
import React, { Suspense } from 'react';

interface PageProps {
  params: { id: number };
}

const Editpage = async ({ params }: PageProps) => {
  const { id } = params; // Extract id from the route parameters
  const [property, similarProperties] = await Promise.all([
    getPropertyById(id),
    getSimilarPropertyById(id)
  ]);
  


  return (
    <div className="w-full min-h-[50vh]">
      <div className="mt-20">
        <Suspense fallback={<Loader className='animate animate-spin text-secondary400' />}>

          <PropertyDetail property={property} similarproperties={similarProperties} />
        </Suspense>
      </div>
    </div>
  );
};

export default Editpage;

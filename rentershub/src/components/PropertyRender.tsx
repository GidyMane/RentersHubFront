"use client"
import React from 'react'

import { motion } from 'framer-motion'
import { PropertyCard } from './Hunter/PropertyCard';


const PropertyRender = ({ property}: { property: any; }) => {
    return (
        <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
           <PropertyCard
                key={property.id}
                id={property.id.toString()}
                title={property.title}
                description={property.description}
                rentPrice={parseFloat(property.rent_price)}
                address={property.address}
                imageUrl={property.main_image_url?.url || "/placeholder.svg"}
                propertyType={property.propertytype?.name}
                city={property.city}
                state={property.state}
                zip={property.postal_code || ""}
                beds={property.bedrooms || 0}
                baths={property.bathrooms || 0}
                sqft={property.size || 0}
              />
        </motion.div>
    )
}

export default PropertyRender
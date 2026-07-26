import type { Property } from '@/types';

// Map Database Row to Property object
export function mapRowToProperty(row: any): Property {
  return {
    id: row.id,
    title: row.title,
    towerName: row.tower_name,
    unitCode: row.unit_code,
    floor: Number(row.floor),
    zone: row.zone,
    condition: row.condition,
    type: row.type,
    category: row.category,
    location: row.location,
    sizeSqm: Number(row.size_sqm),
    area: row.area,
    price: row.price,
    numericPrice: Number(row.numeric_price),
    rentalRateSqm: row.rental_rate_sqm ? Number(row.rental_rate_sqm) : undefined,
    serviceChargeSqm: row.service_charge_sqm ? Number(row.service_charge_sqm) : undefined,
    ceilingHeight: row.ceiling_height || undefined,
    electricityCapacity: row.electricity_capacity || undefined,
    parkingRatio: row.parking_ratio || undefined,
    viewType: row.view_type || undefined,
    image: row.image,
    galleryImages: row.gallery_images ? JSON.parse(row.gallery_images) : [],
    floorPlanImage: row.floor_plan_image || undefined,
    features: row.features ? JSON.parse(row.features) : [],
    description: row.description || undefined,
    featured: Boolean(row.featured),
    bathrooms: row.bathrooms ? Number(row.bathrooms) : undefined,
    bedrooms: row.bedrooms ? Number(row.bedrooms) : undefined,
  };
}

// Map Property object to Database row params
export function mapPropertyToRowParams(property: Partial<Property>) {
  return {
    id: property.id,
    title: property.title || '',
    tower_name: property.towerName || 'Kirana Two Office Tower',
    unit_code: property.unitCode || '',
    floor: property.floor || 1,
    zone: property.zone || 'Low Zone',
    condition: property.condition || 'Bare Shell',
    type: property.type || 'For Rent',
    category: property.category || 'Office Tower',
    location: property.location || 'Jl. Boulevard Timur No. 88, Kelapa Gading, Jakarta Utara',
    size_sqm: property.sizeSqm || 0,
    area: property.area || `${property.sizeSqm || 0} m²`,
    price: property.price || '',
    numeric_price: property.numericPrice || 0,
    rental_rate_sqm: property.rentalRateSqm ?? null,
    service_charge_sqm: property.serviceChargeSqm ?? null,
    ceiling_height: property.ceilingHeight ?? null,
    electricity_capacity: property.electricityCapacity ?? null,
    parking_ratio: property.parkingRatio ?? null,
    view_type: property.viewType ?? null,
    image: property.image || '',
    gallery_images: JSON.stringify(property.galleryImages || []),
    floor_plan_image: property.floorPlanImage ?? null,
    features: JSON.stringify(property.features || []),
    description: property.description ?? null,
    featured: property.featured ? 1 : 0,
    bathrooms: property.bathrooms ?? null,
    bedrooms: property.bedrooms ?? null,
  };
}

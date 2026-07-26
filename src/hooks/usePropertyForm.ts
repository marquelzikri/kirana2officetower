import { useEffect,useState } from 'react';

import { uploadMedia } from '@/services/propertyService';
import type { OfficeCondition, OfficeZone, Property, PropertyType } from '@/types';

interface UsePropertyFormProps {
  initialData?: Property | null;
  isOpen: boolean;
  onSubmit: (data: Partial<Property>) => Promise<void>;
}

export function usePropertyForm({ initialData, isOpen, onSubmit }: UsePropertyFormProps) {
  const [title, setTitle] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [floor, setFloor] = useState<number>(10);
  const [zone, setZone] = useState<OfficeZone>('Mid Zone');
  const [condition, setCondition] = useState<OfficeCondition>('Fully Fitted');
  const [type, setType] = useState<PropertyType>('For Rent');
  const [category, setCategory] = useState('Mid Zone Suite');
  const [sizeSqm, setSizeSqm] = useState<number>(200);
  const [price, setPrice] = useState('IDR 40.0 Juta / bulan');
  const [numericPrice, setNumericPrice] = useState<number>(40000000);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80');
  const [floorPlanImage, setFloorPlanImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [location, setLocation] = useState('Jl. Boulevard Timur No. 88, Kelapa Gading, Jakarta Utara');
  const [viewType, setViewType] = useState('City Skyline View');
  const [electricityCapacity, setElectricityCapacity] = useState('25 kVA');
  const [features, setFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  // Upload States
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingFloorPlan, setIsUploadingFloorPlan] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUnitCode(initialData.unitCode || '');
      setFloor(initialData.floor || 10);
      setZone(initialData.zone || 'Mid Zone');
      setCondition(initialData.condition || 'Fully Fitted');
      setType(initialData.type || 'For Rent');
      setCategory(initialData.category || 'Mid Zone Suite');
      setSizeSqm(initialData.sizeSqm || 200);
      setPrice(initialData.price || '');
      setNumericPrice(initialData.numericPrice || 0);
      setImage(initialData.image || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80');
      setFloorPlanImage(initialData.floorPlanImage || '');
      setGalleryImages(initialData.galleryImages || []);
      setLocation(initialData.location || 'Jl. Boulevard Timur No. 88, Kelapa Gading, Jakarta Utara');
      setViewType(initialData.viewType || 'City Skyline View');
      setElectricityCapacity(initialData.electricityCapacity || '25 kVA');
      setFeatures(initialData.features ? initialData.features.join('\n') : '');
      setDescription(initialData.description || '');
      setFeatured(initialData.featured || false);
    } else {
      setTitle('');
      setUnitCode(`KT-${Math.floor(1000 + Math.random() * 9000)}`);
      setFloor(15);
      setZone('Mid Zone');
      setCondition('Fully Fitted');
      setType('For Rent');
      setCategory('Mid Zone Suite');
      setSizeSqm(250);
      setPrice('IDR 50.0 Juta / bulan');
      setNumericPrice(50000000);
      setImage('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80');
      setFloorPlanImage('');
      setGalleryImages([]);
      setLocation('Jl. Boulevard Timur No. 88, Kelapa Gading, Jakarta Utara');
      setViewType('City Skyline View');
      setElectricityCapacity('30 kVA');
      setFeatures('Akses Lift Penumpang Kecepatan Tinggi\nAC VRV Independen\nKaca Low-E Double Glazed');
      setDescription('');
      setFeatured(false);
    }
    setErrorMsg('');
  }, [initialData, isOpen]);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    setErrorMsg('');
    try {
      const res = await uploadMedia(file);
      setImage(res.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah gambar utama.');
    } finally {
      setIsUploadingMain(false);
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFloorPlan(true);
    setErrorMsg('');
    try {
      const res = await uploadMedia(file);
      setFloorPlanImage(res.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah gambar floor plan.');
    } finally {
      setIsUploadingFloorPlan(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setErrorMsg('');
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fileItem = files.item(i);
        if (fileItem) {
          const res = await uploadMedia(fileItem);
          uploadedUrls.push(res.url);
        }
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah foto galeri.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !unitCode.trim() || !price.trim() || sizeSqm <= 0) {
      setErrorMsg('Harap isi semua kolom wajib (Judul, Kode Unit, Luas, dan Harga).');
      return;
    }

    try {
      const parsedFeatures = features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      await onSubmit({
        title,
        towerName: 'Kirana Two Office Tower',
        unitCode,
        floor: Number(floor),
        zone,
        condition,
        type,
        category,
        sizeSqm: Number(sizeSqm),
        area: `${sizeSqm} m²`,
        price,
        numericPrice: Number(numericPrice),
        image,
        floorPlanImage: floorPlanImage || undefined,
        galleryImages,
        location,
        viewType,
        electricityCapacity,
        features: parsedFeatures,
        description,
        featured,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan properti.');
    }
  };

  return {
    state: {
      title,
      unitCode,
      floor,
      zone,
      condition,
      type,
      category,
      sizeSqm,
      price,
      numericPrice,
      image,
      floorPlanImage,
      galleryImages,
      location,
      viewType,
      electricityCapacity,
      features,
      description,
      featured,
      isUploadingMain,
      isUploadingFloorPlan,
      isUploadingGallery,
      errorMsg,
    },
    setters: {
      setTitle,
      setUnitCode,
      setFloor,
      setZone,
      setCondition,
      setType,
      setCategory,
      setSizeSqm,
      setPrice,
      setNumericPrice,
      setImage,
      setFloorPlanImage,
      setLocation,
      setViewType,
      setElectricityCapacity,
      setFeatures,
      setDescription,
      setFeatured,
    },
    handlers: {
      handleMainImageUpload,
      handleFloorPlanUpload,
      handleGalleryUpload,
      handleRemoveGalleryImage,
      handleSubmit,
    },
  };
}

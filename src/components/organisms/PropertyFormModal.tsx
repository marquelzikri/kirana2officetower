import React, { useState, useEffect } from 'react';
import type { Property, OfficeZone, OfficeCondition, PropertyType } from '../../types';
import { uploadMedia } from '../../services/propertyService';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Property>) => Promise<void>;
  initialData?: Property | null;
  isLoading?: boolean;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
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
      // Reset form
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

  if (!isOpen) return null;

  // Handle Main Image File Upload
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

  // Handle Floor Plan Upload
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

  // Handle Gallery Image Upload
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between bg-surface-variant/30">
          <div>
            <h3 className="font-heading-md font-bold text-on-surface">
              {initialData ? 'Edit Properti Listing' : 'Tambah Properti Baru'}
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              {initialData ? `Mengubah data unit ${initialData.unitCode}` : 'Isi formulir berikut untuk menambah unit perkantoran ke Cloudflare D1 & R2.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-outline-variant/10 transition-colors"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section: Basic Information */}
          <div>
            <h4 className="font-title-sm text-heritage-red font-semibold uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-2">
              Informasi Dasar Unit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Judul Properti <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kirana Two - High Zone Executive Suite"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Kode Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  placeholder="KT-2801"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Lantai
                </label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Zona Gedung
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as OfficeZone)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                >
                  <option value="Low Zone">Low Zone</option>
                  <option value="Mid Zone">Mid Zone</option>
                  <option value="High Zone">High Zone</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Kondisi Fit-Out
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as OfficeCondition)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                >
                  <option value="Bare Shell">Bare Shell</option>
                  <option value="Semi-Fitted">Semi-Fitted</option>
                  <option value="Fully Fitted">Fully Fitted</option>
                  <option value="Serviced Office">Serviced Office</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Tipe Transaksi
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                >
                  <option value="For Rent">Disewakan (For Rent)</option>
                  <option value="For Sale">Dijual (For Sale)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Kategori Space
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="High Zone Suite"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Section: Size & Pricing */}
          <div>
            <h4 className="font-title-sm text-heritage-red font-semibold uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-2">
              Ukuran & Spesifikasi Harga
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Luas Space (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={sizeSqm}
                  onChange={(e) => setSizeSqm(Number(e.target.value))}
                  min={10}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Harga Format Teks <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="IDR 83.6 Juta / bulan"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Harga Numerik (IDR)
                </label>
                <input
                  type="number"
                  value={numericPrice}
                  onChange={(e) => setNumericPrice(Number(e.target.value))}
                  min={0}
                  step={1000000}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Section: Cloudflare R2 / S3 Media Uploads */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-2">
              <h4 className="font-title-sm text-heritage-red font-semibold uppercase tracking-wider">
                Upload Media (Cloudflare R2 Storage)
              </h4>
              <span className="text-xs bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-1">
                <Icon name="cloud_upload" className="text-sm" /> S3 / R2 Bucket Enabled
              </span>
            </div>

            <div className="space-y-5">
              {/* 1. Main Property Image */}
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">
                  Gambar Utama Unit (Main Cover Photo)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20">
                  {image ? (
                    <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0 bg-slate-100">
                      <img src={image} alt="Preview Main" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Preview</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-24 rounded-xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0">
                      <Icon name="image" className="text-3xl text-outline-variant" />
                      <span className="text-[11px]">Belum Ada</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl bg-heritage-red text-white font-label-md font-bold hover:bg-heritage-red/90 transition-colors shadow-sm text-sm">
                        <Icon name={isUploadingMain ? 'sync' : 'cloud_upload'} className={`mr-2 ${isUploadingMain ? 'animate-spin' : ''}`} />
                        {isUploadingMain ? 'Mengunggah ke R2...' : 'Unggah File Gambar'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          disabled={isUploadingMain}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-on-surface-variant font-medium">atau gunakan URL di bawah</span>
                    </div>

                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface text-sm focus:outline-none focus:border-heritage-red text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Gallery Images Upload */}
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">
                  Galeri Foto Foto Interior & Eksterior
                </label>
                <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant font-medium">
                      {galleryImages.length} foto tersimpan di galeri unit
                    </span>
                    <label className="cursor-pointer inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border border-heritage-red text-heritage-red font-label-md font-semibold hover:bg-heritage-red/10 transition-colors text-xs">
                      <Icon name={isUploadingGallery ? 'sync' : 'add_photo_alternate'} className={`mr-1.5 ${isUploadingGallery ? 'animate-spin' : ''}`} />
                      {isUploadingGallery ? 'Mengunggah...' : '+ Tambah Foto Galeri'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        disabled={isUploadingGallery}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                      {galleryImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-outline-variant/30 aspect-square bg-slate-100">
                          <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            title="Hapus foto"
                          >
                            <Icon name="close" className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Floor Plan Image Upload */}
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">
                  Gambar Denah / Floor Plan
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20">
                  {floorPlanImage ? (
                    <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0 bg-slate-100">
                      <img src={floorPlanImage} alt="Floor Plan" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 h-24 rounded-xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0">
                      <Icon name="architecture" className="text-3xl text-outline-variant" />
                      <span className="text-[11px]">Tidak Ada</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface font-label-md font-semibold hover:bg-surface-variant/40 transition-colors shadow-sm text-sm">
                      <Icon name={isUploadingFloorPlan ? 'sync' : 'upload_file'} className={`mr-2 ${isUploadingFloorPlan ? 'animate-spin' : ''}`} />
                      {isUploadingFloorPlan ? 'Mengunggah Floor Plan...' : 'Unggah Floor Plan'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFloorPlanUpload}
                        disabled={isUploadingFloorPlan}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={floorPlanImage}
                      onChange={(e) => setFloorPlanImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface text-sm focus:outline-none focus:border-heritage-red text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Specs: View & Electricity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-1">
                    Pemandangan (View)
                  </label>
                  <input
                    type="text"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    placeholder="City Skyline North & Sea View"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-1">
                    Kapasitas Listrik
                  </label>
                  <input
                    type="text"
                    value={electricityCapacity}
                    onChange={(e) => setElectricityCapacity(e.target.value)}
                    placeholder="45 kVA"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Fitur Unit (Satu fitur per baris)
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={3}
                  placeholder="Akses Lift Penumpang Kecepatan Tinggi&#10;AC VRV Independen&#10;Ruang Rapat Terpisah"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tulis deskripsi mendalam mengenai unit perkantoran ini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red text-on-surface"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 accent-heritage-red rounded cursor-pointer"
                />
                <label htmlFor="featured-checkbox" className="font-label-md text-on-surface cursor-pointer select-none">
                  Tampilkan sebagai <strong className="text-heritage-red">Properti Unggulan (Featured)</strong> di Beranda
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isUploadingMain || isUploadingGallery || isUploadingFloorPlan}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading || isUploadingMain || isUploadingGallery || isUploadingFloorPlan}>
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Icon name="sync" className="animate-spin text-lg" />
                  <span>Menyimpan...</span>
                </span>
              ) : (
                <span>{initialData ? 'Simpan Perubahan' : 'Tambah Properti'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

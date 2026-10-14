'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Address } from '@/types';
import { GUNTUR_LOCALITIES, isWithinDeliveryRadius } from '@/lib/geo';
import { MapPin, Navigation, Plus, Check, X, Home, Briefcase, AlertCircle } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const { deliveryAddress, setDeliveryAddress } = useCart();
  const [showAddForm, setShowAddForm] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [recipientName, setRecipientName] = useState(deliveryAddress.recipientName || 'Priya Sharma');
  const [recipientPhone, setRecipientPhone] = useState(deliveryAddress.recipientPhone || '9848022334');
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('Arundelpet');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!isOpen) return null;

  const handleSelectPredefined = (loc: typeof GUNTUR_LOCALITIES[0]) => {
    const geo = isWithinDeliveryRadius(loc.lat, loc.lng);
    if (!geo.allowed) {
      setErrorMsg(`Sorry! ${loc.name} is ${geo.distanceKm} km away, which is outside Cake Box's 12 km delivery radius.`);
      return;
    }
    setErrorMsg('');
    const newAddr: Address = {
      ...deliveryAddress,
      locality: loc.name,
      street: `${loc.name} Main Road`,
      latitude: loc.lat,
      longitude: loc.lng,
    };
    setDeliveryAddress(newAddr);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setErrorMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const check = isWithinDeliveryRadius(lat, lng);
        if (!check.allowed) {
          setErrorMsg(
            `Your current location is ${check.distanceKm} km away. Cake Box currently delivers within 12 km of Brodipet, Guntur.`
          );
          return;
        }
        const detectedAddr: Address = {
          ...deliveryAddress,
          houseFlat: 'Detected GPS Location',
          street: 'Guntur City Area',
          locality: 'Guntur City Center',
          latitude: lat,
          longitude: lng,
        };
        setDeliveryAddress(detectedAddr);
        onClose();
      },
      (err) => {
        setLocating(false);
        setErrorMsg('Could not detect location. Please select your Guntur locality below.');
      },
      { timeout: 10000 }
    );
  };

  const handleSaveCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseFlat || !street) {
      setErrorMsg('Please fill in House/Flat number and Street details.');
      return;
    }

    const matchedLoc = GUNTUR_LOCALITIES.find((l) => l.name === selectedLocality) || GUNTUR_LOCALITIES[1];
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      recipientName,
      recipientPhone,
      houseFlat,
      street,
      locality: selectedLocality,
      landmark,
      city: 'Guntur',
      state: 'Andhra Pradesh',
      pincode: '522002',
      addressType,
      latitude: matchedLoc.lat,
      longitude: matchedLoc.lng,
      isDefault: true,
    };

    setDeliveryAddress(newAddr);
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-amber-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#4A2E18] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E85A71]" />
              Choose Delivery Location
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Serving Brodipet, Arundelpet, Lakshmipuram & all of Guntur
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current Address Card */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
            <div className="text-xs font-semibold text-[#C68B59] uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <Check className="w-4 h-4 text-emerald-600" /> Currently Delivering To
            </div>
            <div className="font-medium text-gray-800 text-sm">
              {deliveryAddress.houseFlat}, {deliveryAddress.street}
            </div>
            <div className="text-xs text-gray-500">
              {deliveryAddress.locality}, {deliveryAddress.city} — {deliveryAddress.pincode}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Contact: {deliveryAddress.recipientName} ({deliveryAddress.recipientPhone})
            </div>
          </div>

          {/* GPS Quick Action */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-dashed border-[#E85A71] text-[#E85A71] font-semibold text-sm hover:bg-[#FDE8EC] transition-all disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Detecting your Guntur location...' : 'Use My Current Location'}
          </button>

          {!showAddForm ? (
            <>
              {/* Locality Quick Select */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Select Popular Guntur Localities
                  </span>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-xs font-semibold text-[#E85A71] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Enter Full Address
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {GUNTUR_LOCALITIES.map((loc) => {
                    const isSelected = deliveryAddress.locality === loc.name;
                    return (
                      <button
                        key={loc.name}
                        onClick={() => handleSelectPredefined(loc)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#4A2E18] bg-[#4A2E18] text-white font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-amber-400 bg-white text-gray-700 hover:bg-amber-50/40'
                        }`}
                      >
                        <span className="truncate">{loc.name}</span>
                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-amber-200' : 'text-gray-400'}`}>
                          ~{loc.distanceKm} km from Brodipet
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Custom Address Form */
            <form onSubmit={handleSaveCustomAddress} className="space-y-3.5 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#4A2E18]">Enter Detailed Delivery Address</h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Back to list
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 block mb-1">Flat / House No.</label>
                  <input
                    type="text"
                    required
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                    placeholder="e.g. Flat 302, Sai Apts"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 block mb-1">Guntur Locality</label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18] bg-white"
                  >
                    {GUNTUR_LOCALITIES.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-600 block mb-1">Street / Road / Lane</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  placeholder="e.g. 4th Lane, Beside SBI"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-600 block mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                  placeholder="e.g. Near ICICI Bank / NTR Circle"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-600 block mb-1">Save As</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 ${
                        addressType === type
                          ? 'border-[#4A2E18] bg-[#4A2E18] text-white'
                          : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'Home' && <Home className="w-3.5 h-3.5" />}
                      {type === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-semibold shadow-md transition-all mt-2"
              >
                Save & Deliver Here
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

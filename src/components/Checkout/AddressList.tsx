"use client";

import { cn } from "@/utils/utils";
import React from "react";
import { useUpdateEffect } from "react-use";

interface AddressData {
  id: number;
  area_id: number;
  area_name: string;
  branch_id: number;
  branch_name: string;
  building: string;
  city_id: number;
  city_name: string;
  customer_id: number;
  flat: number;
  floor: number;
  phone: string;
  special_sign: string;
  street: string;
}

interface AddressListProps {
  addresses: AddressData[];
  selectedAddressId: number | null;
  onSelectAddress: (address: AddressData) => void;
  children?: React.ReactNode;
}

export default function AddressList({
  addresses,
  selectedAddressId,
  onSelectAddress,
}: AddressListProps) {
  // Auto select first address if no selected address
  useUpdateEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      onSelectAddress(addresses[0]);
    }
  }, [addresses, selectedAddressId]);

  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-3 rounded-lg border border-gray-200 px-4 py-6">
      <div className="max-h-[300px] space-y-2 overflow-y-auto">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => onSelectAddress(address)}
            className={cn(
              "cursor-pointer rounded-md border p-3 transition hover:border-orange-400",
              selectedAddressId === address.id
                ? "border-2 border-orange-500 bg-orange-50"
                : "border-gray-200",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  {address.city_name}, {address.area_name},{" "}
                  {address.branch_name}
                </p>
                <p className="text-sm text-gray-600">
                  شارع: {address.street}, عمارة: {address.building}, طابق:{" "}
                  {address.floor}, شقة: {address.flat}
                </p>
                {address.special_sign && (
                  <p className="text-sm text-gray-600">
                    علامة مميزة: {address.special_sign}
                  </p>
                )}
                <p className="text-sm text-gray-600">هاتف: {address.phone}</p>
              </div>
              {selectedAddressId === address.id && (
                <span className="flex-shrink-0 text-orange-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

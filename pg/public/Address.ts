// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type CityCityId } from './City';

/** Identifier type for public.address */
export type AddressAddressId = number & { __brand: 'AddressAddressId' };

/** Represents the table public.address */
export default interface Address {
  address_id: AddressAddressId;

  address: string;

  address2: string | null;

  district: string;

  city_id: CityCityId;

  postal_code: string | null;

  phone: string;

  last_update: Date;
}

/** Represents the initializer for the table public.address */
export interface AddressInitializer {
  /** Default value: nextval('address_address_id_seq'::regclass) */
  address_id?: AddressAddressId;

  address: string;

  address2?: string | null;

  district: string;

  city_id: CityCityId;

  postal_code?: string | null;

  phone: string;

  /** Default value: now() */
  last_update?: Date;
}

/** Represents the mutator for the table public.address */
export interface AddressMutator {
  address_id?: AddressAddressId;

  address?: string;

  address2?: string | null;

  district?: string;

  city_id?: CityCityId;

  postal_code?: string | null;

  phone?: string;

  last_update?: Date;
}

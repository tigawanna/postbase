// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type UserId } from './User';

/** Identifier type for public.Internship */
export type InternshipId = string & { __brand: 'InternshipId' };

/** Represents the table public.Internship */
export default interface Internship {
  id: InternshipId;

  createdAt: Date;

  updatedAt: Date;

  description: string;

  from: Date;

  to: Date;

  role: string;

  company: string;

  userId: UserId;
}

/** Represents the initializer for the table public.Internship */
export interface InternshipInitializer {
  id: InternshipId;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  updatedAt: Date;

  description: string;

  from: Date;

  to: Date;

  role: string;

  company: string;

  userId: UserId;
}

/** Represents the mutator for the table public.Internship */
export interface InternshipMutator {
  id?: InternshipId;

  createdAt?: Date;

  updatedAt?: Date;

  description?: string;

  from?: Date;

  to?: Date;

  role?: string;

  company?: string;

  userId?: UserId;
}

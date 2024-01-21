// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.User */
export type UserId = string & { __brand: 'UserId' };

/** Represents the table public.User */
export default interface User {
  _id: UserId;

  createdAt: Date;

  updatedAt: Date;

  username: string;

  email: string;

  avatar: string | null;

  about_me: string | null;

  github_username: string | null;

  linkedin_username: string | null;

  country: string | null;

  city: string | null;

  phone: string | null;

  skills: string | null;

  name: string | null;

  last_letter_on: string | null;

  last_resume_on: string | null;
}

/** Represents the initializer for the table public.User */
export interface UserInitializer {
  _id: UserId;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  updatedAt: Date;

  username: string;

  email: string;

  avatar?: string | null;

  about_me?: string | null;

  github_username?: string | null;

  linkedin_username?: string | null;

  country?: string | null;

  city?: string | null;

  phone?: string | null;

  skills?: string | null;

  name?: string | null;

  last_letter_on?: string | null;

  last_resume_on?: string | null;
}

/** Represents the mutator for the table public.User */
export interface UserMutator {
  _id?: UserId;

  createdAt?: Date;

  updatedAt?: Date;

  username?: string;

  email?: string;

  avatar?: string | null;

  about_me?: string | null;

  github_username?: string | null;

  linkedin_username?: string | null;

  country?: string | null;

  city?: string | null;

  phone?: string | null;

  skills?: string | null;

  name?: string | null;

  last_letter_on?: string | null;

  last_resume_on?: string | null;
}

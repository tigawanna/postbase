// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type default as Year } from './Year';
import { type LanguageLanguageId } from './Language';
import { type default as MpaaRating } from './MpaaRating';

/** Identifier type for public.film */
export type FilmFilmId = number & { __brand: 'FilmFilmId' };

/** Represents the table public.film */
export default interface Film {
  film_id: FilmFilmId;

  title: string;

  description: string | null;

  release_year: Year | null;

  language_id: LanguageLanguageId;

  rental_duration: number;

  rental_rate: string;

  length: number | null;

  replacement_cost: string;

  rating: MpaaRating | null;

  last_update: Date;

  special_features: string[] | null;

  fulltext: unknown;
}

/** Represents the initializer for the table public.film */
export interface FilmInitializer {
  /** Default value: nextval('film_film_id_seq'::regclass) */
  film_id?: FilmFilmId;

  title: string;

  description?: string | null;

  release_year?: Year | null;

  language_id: LanguageLanguageId;

  /** Default value: 3 */
  rental_duration?: number;

  /** Default value: 4.99 */
  rental_rate?: string;

  length?: number | null;

  /** Default value: 19.99 */
  replacement_cost?: string;

  /** Default value: 'G'::mpaa_rating */
  rating?: MpaaRating | null;

  /** Default value: now() */
  last_update?: Date;

  special_features?: string[] | null;

  fulltext: unknown;
}

/** Represents the mutator for the table public.film */
export interface FilmMutator {
  film_id?: FilmFilmId;

  title?: string;

  description?: string | null;

  release_year?: Year | null;

  language_id?: LanguageLanguageId;

  rental_duration?: number;

  rental_rate?: string;

  length?: number | null;

  replacement_cost?: string;

  rating?: MpaaRating | null;

  last_update?: Date;

  special_features?: string[] | null;

  fulltext?: unknown;
}
// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type FilmFilmId } from './Film';
import { type default as MpaaRating } from './MpaaRating';

/** Represents the view public.nicer_but_slower_film_list */
export default interface NicerButSlowerFilmList {
  fid: FilmFilmId;

  title: string;

  description: string | null;

  category: string;

  price: string;

  length: number | null;

  rating: MpaaRating | null;

  actors: string;
}

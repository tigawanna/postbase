// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.language */
export type LanguageLanguageId = number & { __brand: 'LanguageLanguageId' };

/** Represents the table public.language */
export default interface Language {
  language_id: LanguageLanguageId;

  name: string;

  last_update: Date;
}

/** Represents the initializer for the table public.language */
export interface LanguageInitializer {
  /** Default value: nextval('language_language_id_seq'::regclass) */
  language_id?: LanguageLanguageId;

  name: string;

  /** Default value: now() */
  last_update?: Date;
}

/** Represents the mutator for the table public.language */
export interface LanguageMutator {
  language_id?: LanguageLanguageId;

  name?: string;

  last_update?: Date;
}
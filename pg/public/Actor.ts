// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.actor */
export type ActorActorId = number & { __brand: 'ActorActorId' };

/** Represents the table public.actor */
export default interface Actor {
  actor_id: ActorActorId;

  first_name: string;

  last_name: string;

  last_update: Date;
}

/** Represents the initializer for the table public.actor */
export interface ActorInitializer {
  /** Default value: nextval('actor_actor_id_seq'::regclass) */
  actor_id?: ActorActorId;

  first_name: string;

  last_name: string;

  /** Default value: now() */
  last_update?: Date;
}

/** Represents the mutator for the table public.actor */
export interface ActorMutator {
  actor_id?: ActorActorId;

  first_name?: string;

  last_name?: string;

  last_update?: Date;
}
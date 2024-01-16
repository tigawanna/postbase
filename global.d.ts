import { TypedPocketBase } from "typed-pocketbase";
import { Schema } from "src/lib/pb/db-types";
import { postgresInstance } from "@/lib/pg/pg";

declare module "rakkasjs" {
    interface PageLocals {
        /** My application-specific stuff */
        pb: TypedPocketBase<Schema>;
        pg: typeof postgresInstance
    }
    interface ServerSideLocals {
        /** My application-specific stuff */
       pb: TypedPocketBase<Schema>;
       pg: typeof postgresInstance
    }
}


declare interface ReturnedError {
    error: {
        message: string;
        original_error: string,

    }
}

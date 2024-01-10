import { parseEnv } from "znv";
import { z } from "zod";



export const { RAKKAS_PB_URL } = parseEnv(import.meta.env, {
    RAKKAS_PB_URL: z.string().min(1),
});



// export const pb_url = import.meta.env.RAKKAS_PB_URL
// export const pb_auth_collection = import.meta.env.RAKKAS_PB_AUTH_COLLECTION

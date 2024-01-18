import postgres from "postgres";
import { PageProps, useSSQ } from "rakkasjs"
export default function TestPage({}:PageProps) {
    const query = useSSQ(async()=>{
        try {
            const sql = postgres(
                    ""            );
            const users = (await sql`SELECT * FROM user`) as any as [
              { id: number, name: string },
            ]
            console.log("remote users ==== ",users)
            
        } catch (error) {
            console.log("Error == ",error)
        }
    })
return (
<div className="w-full h-full min-h-screen flex items-center justify-center">

</div>
)}

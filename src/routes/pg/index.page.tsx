import { PageProps, useSSQ } from "rakkasjs"
import { Suspense } from "react"
import { Databases, DatabasesSuspenseFallBack } from "./components/Databases"




export default function PostgresPage({}:PageProps) {
return (
<div className="w-full h-full  flex items-center justify-center">
 <Suspense fallback={<DatabasesSuspenseFallBack/>}>
    <Databases />
  </Suspense>
  </div>
)}

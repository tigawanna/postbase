import { PageProps, useSSQ } from "rakkasjs"
import { Suspense } from "react"
import { Databases } from "./components/Databases"
import ErrorBoundaryComponent from "@/components/navigation/ErrorBoundaryComponent"



export default function PostgresPage({}:PageProps) {
return (
<div className="w-full h-full min-h-screen flex items-center justify-center">
 
  <Suspense fallback={<div>Loading...</div>}>
    <Databases />
  </Suspense>
    

</div>
)}

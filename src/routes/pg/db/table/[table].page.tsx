import { PageProps } from "rakkasjs"
import { Suspense } from "react"
import { OneTable } from "./components/OneTable"
export default function OneTablePage({params}:PageProps) {
return (
<div className="w-full h-full min-h-screen flex items-center justify-center">
<Suspense fallback={<div>Loading...</div>}>
    <OneTable table_name={params.table}/>
</Suspense>
</div>
)}

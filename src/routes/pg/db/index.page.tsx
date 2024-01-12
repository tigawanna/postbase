import { PageProps } from "rakkasjs"
import { Suspense } from "react";
import { Databases } from "../components/Databases";
export default function DatabasesPage({}:PageProps) {
return (
  <div className="w-full h-full min-h-screen flex items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
      <Databases />
    </Suspense>
  </div>
);}

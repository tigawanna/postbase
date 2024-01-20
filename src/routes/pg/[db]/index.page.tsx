import { PageProps, Redirect, navigate } from "rakkasjs";
import { Suspense } from "react";
import { OneDatabase } from "./components/OneDatabase";

export default function OneDatabasePage({ params, url }: PageProps) {
  const db_name = params.db;
  if (!db_name) {
    return <Redirect href="/pg" />;
  }
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <OneDatabase db_name={db_name} key={db_name} />
      </Suspense>
    </div>
  );
}

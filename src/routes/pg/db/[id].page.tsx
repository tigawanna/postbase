
import { PageProps, navigate } from "rakkasjs";
import { Suspense } from "react";
import { OneDatabase } from "./components/OneDatabase";

export default function OneDatabasePage({ params, url }: PageProps) {
  const db_name = params.id;
  const db_user = url.searchParams.get("name");
  const db_password = url.searchParams.get("password");

if(!db_name||!db_user||!db_password){
  return navigate("..");
}
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
    <Suspense fallback={<div>Loading...</div>}>
        <OneDatabase  db_name={db_name} db_user={db_user} db_password={db_password}/>
    </Suspense>
    </div>
  );
}

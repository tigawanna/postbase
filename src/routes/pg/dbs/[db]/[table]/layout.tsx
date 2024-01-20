import { LayoutProps, Link, Redirect } from "rakkasjs";
export default function OneTableLayout({ children, params, url }: LayoutProps) {
  const db_name = params.db;
  const db_table = params.table;

  const db_primary_column = url.searchParams.get("column");

  if (!db_name || !db_table || !db_primary_column) {
    const redirect_url = url;
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }
  const paths = [
    { name: "list", url: "/" },
    { name: "types", url: "/types" },
  ];
  const pathname = url.pathname;
  const types_route = url.pathname;
  // console.log("tyeps route  ==  ",url.toString())
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <div className="text-xl  w-full flex justify-between h-fit p-1 bg-base-300">
        <div className="text-xl  w-full  ">
          {params.table} table
        </div>
        {/* <div className="w-full flex gap-3 text-sm">
          {paths.map((path) => {
            const new_url = new URL(url);
            new_url.pathname = pathname + path.url;
            new_url.searchParams.set("column", db_primary_column);

            console.log("url", new_url.pathname);
            return (
              <Link
                className="hover:text-sky-600"
                href={pathname}
                key={new_url.toString()}
              >
                {path.name}
              </Link>
            );
          })}
        </div> */}
      </div>
      {children}
    </div>
  );
}

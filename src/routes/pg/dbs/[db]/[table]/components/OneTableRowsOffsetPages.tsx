import { Button } from "@/components/shadcn/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/shadcn/ui/pagination";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import postgres from "postgres";
import { navigate } from "rakkasjs";
import {
  Redirect,
  runServerSideQuery,
  usePageContext,
  useRequestContext,
  useSSQ,
} from "rakkasjs";
      import ReactPaginate from "react-paginate";
      import RCPagination from 'rc-pagination';
interface OneTableRowsOffsetPagesProps {
  db_name: string;
  db_table: string;
  db_user: string;
  db_password: string;
  db_primary_column: string;
}
export function OneTableRowsOffsetPages({
  db_name,
  db_table,
  db_primary_column,
  db_password,
  db_user,
}: OneTableRowsOffsetPagesProps) {
  const page_ctx = usePageContext();
  const url = page_ctx.url;
  const table_page = parseInt(url.searchParams.get("tp") ?? "0");
  
  const query = useSSQ(async (ctx) => {
    try {
      const offset = (table_page - 1) * 10;
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
      const rows = (await sql`
      SELECT * from ${sql(db_table)} 
      ORDER BY ${sql(db_primary_column)}
      OFFSET ${offset}
      LIMIT 10`) as any as [{ [key: string]: any }];
      //   console.log(" === tabless == ", rows);
      return { rows, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { rows: null, error: error.message };
    }
  });

  if (query.data.error) {
    const redirect_url = page_ctx.url;
    redirect_url.pathname = `pg/dbs/${db_name}`;
    return <Redirect href={redirect_url.toString()} />;
  }

  const rows = query.data.rows;
  if (!rows) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        empty table
      </div>
    );
  }
  return (
    <div className="w-full h-screen overflow-auto space-y-2">
      <div className="w-full py-3 flex flex-col">
        <OneTableRowsOffsetpagesPaginator
          db_name={db_name}
          db_table={db_table}
          db_user={db_user}
          db_password={db_password}
          db_primary_column={db_primary_column}
        />
      </div>
      <table className="w-full table ">
        <thead className="sticky top-0 ">
          {rows[0] && (
            <tr className="text-lg divide-accent divide-x-4 ">
              {Object.keys(rows[0]).map((key, idx) => (
                <th className="bg-base-300 " key={key + idx}>
                  {key}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((row: any, idx: any) => {
            const row_key = JSON.stringify(row ?? {});
            return (
              <tr key={row_key + idx} className="hover:bg-base-300">
                {Object.values(row).map((value, idx) => {
                  if (!value) {
                    return;
                  }
                  if (typeof value === "object" || Array.isArray(value)) {
                    return (
                      <td
                        className=""
                        key={row_key + JSON.stringify(value) + idx}
                      >
                        {JSON.stringify(value)}
                      </td>
                    );
                  }
                  return (
                    <td className="" key={row_key + value + idx}>
                      {/*@ts-expect-error */}
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-full py-3 flex flex-col">
        <OneTableRowsOffsetpagesPaginator
          db_name={db_name}
          db_table={db_table}
          db_user={db_user}
          db_password={db_password}
          db_primary_column={db_primary_column}
        />
      </div>
    </div>
  );
}

interface OneTableRowsOffsetpagesPaginatorProps {
  db_name: string;
  db_table: string;
  db_user: string;
  db_password: string;
  db_primary_column: string;
}

export function OneTableRowsOffsetpagesPaginator({
  db_name,
  db_table,
  db_primary_column,
  db_password,
  db_user,
}: OneTableRowsOffsetpagesPaginatorProps) {
  const page_ctx = usePageContext();
  const url = page_ctx.url;
  const table_page = parseInt(url.searchParams.get("tp") ?? "0");
  const query = useSSQ(async (ctx) => {
    try {
      const offset = (2 - 1) * 10;
      const sql = postgres({
        host: "localhost",
        user: db_user!,
        password: db_password!,
        database: db_name!,
      });
      const rows = (await sql`
      SELECT COUNT(*) FROM ${sql(db_table)}`) as any as [{count:number}];
        console.log(" === tabless == ", rows);
      return { rows, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { rows: null, error: error.message };
    }
  });
  const total = query.data?.rows?.[0].count
  const total_pages = (total??10)/10
  // console.log({total_pages})
  return (
    <div className="w-full h-full flex  items-center justify-center ">
      <div className="flex flex-col gap-2 ">

      </div>

      <ReactPaginate
        className="flex gap-2 selection:items-center justify-center "
        pageClassName="btn btn-sm hover:btn-accent"
        nextClassName="btn btn-sm hover:btn-accent"
        previousClassName="btn btn-sm hover:btn-accent"
        activeClassName="btn btn-accent"
        disabledClassName="brightness-50"
        breakLabel="..."
        nextLabel="next >"
        // initialPage={table_page}
        forcePage={table_page -1}
        onPageChange={(e) => {
          const new_url = url;
          new_url.searchParams.set("tp", (e.selected + 1).toString());
          navigate(new_url.toString(),{replace:true});
        }}
        pageRangeDisplayed={5}
        pageCount={total_pages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}




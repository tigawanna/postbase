import { DbAuthProps, postgresInstance } from "@/lib/pg/pg";
import { safeDestr } from "destr";
import { navigate } from "rakkasjs";
import { Redirect, usePageContext, useSSQ } from "rakkasjs";
import { useMemo, useState } from "react";
import ReactPaginate from "react-paginate";

interface OneTableRowsOffsetPagesProps {
  db_name: string;
  db_table: string;
  db_primary_column: string;
}
export function OneTableRowsOffsetPages({
  db_name,
  db_table,
  db_primary_column,
}: OneTableRowsOffsetPagesProps) {
  const page_ctx = usePageContext();
  const url = page_ctx.url;
  const table_page = parseInt(url.searchParams.get("tp") ?? "1");
  const [sortColumn, setSortColumn] = useState(db_primary_column);
  const [sortDirection, setSortDirection] = useState("");
  const query = useSSQ(
    async (ctx) => {
      try {
        const offset = (table_page - 1) * 10;
        const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
        if (!config || !config?.local_or_remote) {
          return { rows: null, error: "no config" };
        }
        const sql = postgresInstance(config);
        if (!sql) {
          return { rows: null, error: "no config" };
        }

        const rows = (await sql`
      SELECT * from ${sql(db_table)} 
      ORDER BY ${sql(db_primary_column)}
      OFFSET ${offset}
      LIMIT 10`) as any as [{ [key: string]: any }];
        // console.log(" === tabless == ", {db_table, db_primary_column, offset, rows});
        return { rows, error: null };
      } catch (error: any) {
        console.log(
          " === useSSQ OneTableRowsOffsetPages error == ",
          error.message,
        );
        return { rows: null, error: error.message };
      }
    },
    { key: `${db_name}/${db_table}` },
  );

  const rows = query.data.rows;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (sortColumn && rows) {
      const sorted = [...rows];
      sorted.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      return sorted;
    }
    return rows;
  }, [rows, sortColumn, sortDirection]);

  if (query.data.error) {
    const redirect_url = page_ctx.url;
    redirect_url.pathname = `pg/${db_name}`;
    // console.log("error loading table === ", query.data.error);
    // console.log("redirecting to ", redirect_url.toString());
    return <Redirect href={redirect_url.toString()} />;
  }

  if (!rows || !sortedRows) {
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
        />
      </div>
      <table className="w-full table ">
        <thead className="sticky top-0 ">
          {rows[0] && (
            <tr className="text-lg  rounded-lg gap-2">
              {Object.keys(rows[0]).map((key, idx) => (
                <th
                  className="bg-base-200 text-accent  rounded-lg cursor-pointer"
                  key={key + idx}
                  onClick={() => handleSort(key)}
                >
                  {key}
                  {sortColumn === key && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {sortedRows?.map((row: any, idx: any) => {
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
        />
      </div>
    </div>
  );
}

interface OneTableRowsOffsetpagesPaginatorProps {
  db_name: string;
  db_table: string;
}

export function OneTableRowsOffsetpagesPaginator({
  db_name,
  db_table,
}: OneTableRowsOffsetpagesPaginatorProps) {
  const page_ctx = usePageContext();
  const url = page_ctx.url;
  const table_page = parseInt(url.searchParams.get("tp") ?? "0");
  const query = useSSQ(
    async (ctx) => {
      try {
        const offset = (2 - 1) * 10;
        const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
        if (!config || !config?.local_or_remote) {
          return { rows: null, error: "no config" };
        }
        const sql = postgresInstance(config);
        if (!sql) {
          return { rows: null, error: "no config" };
        }
        const rows = (await sql`
      SELECT COUNT(*) FROM ${sql(db_table)}`) as any as [{ count: number }];
        // console.log(" === table rows count == ", rows);
        return { rows, error: null };
      } catch (error: any) {
        console.log(
          " === useSSQ OneTableRowsOffsetpagesPaginator error == ",
          error.message,
        );
        return { rows: null, error: error.message };
      }
    },
    { key: `${db_name}/${db_table}` },
  );
  const total = query.data?.rows?.[0].count;
  const total_pages = Math.ceil((total ?? 10) / 10);
  // console.log({total_pages})
  return (
    <div className="w-full h-full flex  items-center justify-center ">
      <div className="flex flex-col gap-2 "></div>

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
        forcePage={table_page - 1}
        onPageChange={(e) => {
          const new_url = url;
          new_url.searchParams.set("tp", (e.selected + 1).toString());
          navigate(new_url.toString(), { replace: true });
        }}
        pageRangeDisplayed={5}
        pageCount={total_pages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import postgres from "postgres";
import {
  ActionContext,
  ActionResult,
  Head,
  PageProps,
  Redirect,
  useSubmit,
} from "rakkasjs";

export interface LocalDBAuthProps {
  local_or_remote: "local";
  db_name: string;
  db_password: string;
  db_user: string;
  db_host: string;
}
export interface LocalDBAuthFormAction {
  fields: LocalDBAuthProps;
  error_message?: string;
  success_message?: string;
}
export default function FormsPage({ actionData }: PageProps) {
  const { submitHandler } = useSubmit();
  const {
    fields: { db_host, db_name, db_password, db_user },
    error_message,
    success_message,
  } = actionData as LocalDBAuthFormAction;

  return (
    <form method="POST" onSubmit={submitHandler}>
      <Head title="Connect To DB" />
      <div className="flex flex-col gap-2">
        {/* database user name */}
        <div className="space-y-1 bg-base-200 px-4  rounded-xl">
          <Label htmlFor="db_user" className="font-bold">
            DB User
          </Label>
          <Input id="db_user" defaultValue={db_user} />
        </div>
        {/* database password */}
        <div className="space-y-1 font-bold bg-base-200 px-4 py-1 rounded-xl">
          <Label htmlFor="db_password">DB Password</Label>
          <Input id="db_password" defaultValue={db_password} />
        </div>
        {/* database name */}
        <div className="space-y-1 bg-base-200 px-4 py-1 rounded-xl">
          <Label htmlFor="db_name" className="font-bold ">
            DB Name
          </Label>
          <Input id="db_anme" defaultValue={db_name} />
        </div>

        {/* database host */}
        <div className="space-y-1 bg-base-200 px-4 py-1 rounded-xl">
          <Label htmlFor="db_host" className="font-bold">
            DB Host
          </Label>
          <Input id="db_host" defaultValue={db_host} />
        </div>
      </div>
      {success_message && (
        <p
          className="animate-in fade-in zoom-in bg-success/10 text-success"
          style={{ color: "green" }}
        >
          {success_message}
        </p>
      )}
      {error_message && (
        <p
          className="animate-in fade-in zoom-in bg-error/10 text-error"
          style={{ color: "red" }}
        >
          {error_message}
        </p>
      )}
    </form>
  );
}

export async function action(
  ctx: ActionContext,
): Promise<ActionResult<LocalDBAuthFormAction>> {
  const formData = await ctx.requestContext.request.formData();
  const db_name = formData.get("db_name")?.toString();
  const db_password = formData.get("db_password")?.toString();
  const db_user = formData.get("db_user")?.toString();
  const db_host = formData.get("db_host")?.toString();

  try {
    if (!db_name || !db_password || !db_user || !db_host) {
      return {
        data: {
          fields: {
            db_name: db_name || "postgres",
            db_password: db_password || "postgres",
            db_user: db_user || "postgres",
            db_host: db_host || "localhost",
            local_or_remote: "local",
          },
          error_message: "All fields are required",
        },
      };
    }
    const sql = postgres({
      host: db_host,
      user: db_user,
      password: db_password,
      database: db_name,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
    const database = (await sql`SELECT datname FROM pg_database`) as any as [
      { datname: string },
    ];
    // return {

    // }

    return {
headers(headers) {
    
},
      data: {
        fields: {
          db_name: db_name || "postgres",
          db_password: db_password || "postgres",
          db_user: db_user || "postgres",
          db_host: db_host || "localhost",
          local_or_remote: "local",
        },
        success_message: `Connected to ${db_name}`,
      },
    };
  } catch (error: any) {
    return {
      data: {
        fields: {
          db_name: db_name || "postgres",
          db_password: db_password || "postgres",
          db_user: db_user || "postgres",
          db_host: db_host || "localhost",
          local_or_remote: "local",
        },
        error_message: "Error: " + error.message,
      },
    };
  }
}

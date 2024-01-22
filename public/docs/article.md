I recently saw a job opening where they wanted a Nodejs ,TypeORM and  GraphQL developer  So I decided now would be a good time to brush up on those skills

Throw back to 3 years a go when Ben Awad was the predominant react influencer on YouTube when he dropped this absolute banger of [an  intermediate full-stack tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8&t=27865s) 

But before starting with that I went back to do a Postgres refresher and tried out a [freecodecamp video](https://www.youtube.com/watch?v=SpfIwlAYaKk&t=1986s)

In the video they ha a [sample movies database](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip) which I decided to build an app around as practice and expose a GraphQL API of it 

> Checkout sample database [setup part](https://youtu.be/SpfIwlAYaKk?t=123&si=yTZ7JVVl9WypL3PO)

Before we do anything , we'll walk over how we'll use TypeORM with GraphQL

The idea will be to 

- Create a `GraphQl` server with express and `apollo-server-express`
 - Using TypeORM as our ORM to talk to the database with and define the  schema
 - Use `type-graphql` to define the GraphQ schema and resolvers for maximum type safety
 
The TypeORM + TypeGraphQl definition would be a class with respective annotations 

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { ObjectType, Field, Int, InputType } from 'type-graphql'
import { registerEnumType } from "type-graphql";


enum FilmRatings{
PG13 = "PG-13",
    NC17 = "NC-17",
    R = "R",
    G = "G",
    PG = "PG"
}


registerEnumType(FilmRatings, {
    name: "rating", // Mandatory
    description: "The film rating", // Optional
});

@ObjectType()
@InputType()
@Entity()
export class Film {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    film_id: number;

    @Field(()=>String)
    @Column({ type: "text" })
    title: string;

    @Field(() => Int)
    @Column({ type: "integer" })
    release_year: number;

    @Field(() => Int)
    @Column({ type: "smallint" })
    language_id: number;

    @Field(() => Int)
    @Column({ type: "smallint" })
    rental_duration: number;

    @Field(() => Int)
    @Column({ type: "numeric" })
    rental_rate: number;

    @Field(() => Int)
    @Column({ type: "smallint" })
    length: number;

    @Field(() => Int)
    @Column({ type: "numeric" })
    replacement_cost: number;

    @Field(()=>FilmRatings)
    @Column({ type: "enum",enumName: "rating" })
    rating: FilmRatings

    @Field(() => String)
    @Column({ type: "timestamp without time zone" })
    last_update: Date;

    @Field(() => [String])
    @Column({ type: "text", array: true })
    special_features: string[];

    @Field(()=>String)
    @Column({ type: "text" })
    fulltext: string;

}


```

When you already have an existing database you can use the [TypeORM](https://typeorm.io/) option 
`synchronize: false,`

```ts
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "dvdrental",
    synchronize: false,
    migrations: ["src/migrations"],
    entities:["src/entities/*.entity.ts"],
})
```

The issue I immediately ran into was how to use the column types database already as to generate TypeORM schemas manually
There a was a Postgres query to return a table's column types 

```sql
        SELECT table_name,
    (SELECT string_agg(column_name, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS columns,
    (SELECT string_agg(data_type, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS column_types
    FROM information_schema.tables t
  WHERE table_schema = 'public'
```
But it wasn't very clear on Enum types and other types like that for example the film table had  rating column that was an Enum type 

You could get the Enum values using a distinct select

```sql
SELECT DISTINCT rating FROM film
```
But this didn't feel scalable so I built a simple Postgres GUI as a challenge to view the columns and their types and feed that info into an LLM to get a schema. 


[Postbase](https://github.com/tigawanna/postbase) , Am bad at naming things but in It's basics

When loaded up the `/pg` route , This snippet will run and fetch all the databases running on your Postgres server

```tsx
  const query = useSSQ(async (ctx) => {
    try {
     const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
      if (!config) {
        return { result: null, error: "no config" };
      }
      const sql = postgresInstance(config);
      if (!sql) {
        return { result: null, error: "no config" };
      }

      if (config.local_or_remote === "remote") {
        return {
          result: { redirect: `/pg/${sql.options.database}` },
          error: null,
        };
      }
      const database = (await sql`SELECT datname FROM pg_database`) as any as [
        { datname: string },
      ];
      const users = (await sql`SELECT * FROM pg_catalog.pg_user`) as any as [
        { usename: string },
      ];
   
      return { result: { database, users }, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { result: null, error };
    }
  });

```

![databases list](https://github.com/tigawanna/postbase/blob/daec1fcc3f09f6ed797a211c8861012ef4e5f368/public/docs/postbase.jpg)

Clicking on one database will prompt you for it's credentials

![pick database](https://github.com/tigawanna/postbase/blob/main/public/docs/pick-db.jpg)

```tsx
  const query = useSSQ(async (ctx) => {
    // console.log("This is a one database ", db_name);
    try {
      const config = safeDestr<DbAuthProps>(ctx.cookie?.pg_cookie);
     if (!config || !config?.local_or_remote) {
       return { rows: null, error: "no config" };
     }
     const sql = postgresInstance(config);
     if (!sql) {
       return { rows: null, error: "no config" };
     }
      const tables = (await sql`
        SELECT table_name,
    (SELECT string_agg(column_name, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS columns,
    (SELECT string_agg(data_type, ', ')
    FROM information_schema.columns
    WHERE table_schema = t.table_schema
        AND table_name = t.table_name) AS column_types
    FROM information_schema.tables t
  WHERE table_schema = 'public';

        `) as any as [
        {
          table_name: string;
          columns: string;
          column_types: string;
        },
      ];
      // console.log(" === tables == ", tables[0]);
      return { tables, error: null };
    } catch (error: any) {
      console.log(" === error == ", error.message);
      return { tables: null, error: error.message };
    }
  },{key:db_name});

```

![table list](https://github.com/tigawanna/postbase/blob/main/public/docs/table-list.jpg)

Clicking on one table will prompt you to pick one of the rows as the primary key for sorting

![pick table](https://github.com/tigawanna/postbase/blob/main/public/docs/pick-table.jpg)

![table tabs](https://github.com/tigawanna/postbase/blob/main/public/docs/table-tabs.jpg)

The table view consists of 3 tabs

**list**
We select 10 first rows in this table and will get the next 10 using pagination
```tsx
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
``` 

**types**
This part is powered by [kanel](https://github.com/kristiandupont/kanel) to generate the types and 
[Shikiji](https://shikiji.netlify.app/) to style the output

![shikiji code highlighter](https://github.com/tigawanna/postbase/blob/daec1fcc3f09f6ed797a211c8861012ef4e5f368/public/docs/shikiji-code.jpg)

**TypeORM + TypeGraphQl class**

This part is powered by [Gemini AI](https://ai.google.dev/) to generate TypeORM and TypeGraphQl classes from our generated typescript interfaces

![TypeORM + TypeGraphQl class](https://github.com/tigawanna/postbase/blob/main/public/docs/classes.jpg)


Some notable features include 

- a script that reads the type files and concats all the imports together in one
  
```ts
import fs from "fs";
import fsp from "fs/promises";
import path from "path";


export async function getTextFromFileWithImports(
  filePath: string,
  currentText: string,
  dbName: string,
) {
  try {
    let count = 0;
    // console.log("===== file path ======",filePath);
    const fileContent = await fsp.readFile(filePath, "utf8");
    // console.log("===== file content ======",fileContent);
    const importRegex = /import.*?from ['"](.+?)['"];/g;
    let match;
    let updatedText = currentText;
    if (count === 0) {
      updatedText += fileContent;
    }

    while ((match = importRegex.exec(fileContent)) !== null) {
      count += 1;
      const importedFilePath = match[1];
      const absoluteImportedPath = path.resolve(filePath);
      // console.log("===== absolute path  ======",absoluteImportedPath);
      const importedFileContent = fs.readFileSync(absoluteImportedPath, "utf8");
      updatedText += "\n" + importedFileContent;
      const next_file_path =
        path.resolve("pg/" +dbName+"/public", importedFilePath) + ".ts";
      // console.log(" ====== next file path  ======",next_file_path);
      updatedText =
        (await getTextFromFileWithImports(next_file_path, updatedText, dbName)) ?? ""; // Make the process recursive
    }
    //  console.log("===== count  ======",count);
    return updatedText;
  } catch (error) {
    console.log("====== error in readTextFromFileWithImport === ", error);
    return;
  }
}
```

- A helper for Postgresjs to handle local or remote connections config
```ts
import postgres from "postgres";
import { RequestContext } from "rakkasjs";

export function postgresInstance(options?: DbAuthProps) {
  if(!options){
    return
  }
  if (options?.local_or_remote === "local") {
    return postgres({
      host: options.db_host,
      user: options.db_user,
      password: options.db_password,
      database: options.db_name,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
  }
  return postgres(options.connection_url, {
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });
}

export interface LocalDBAuthProps {
  local_or_remote: "local";
  db_name: string;
  db_password: string;
  db_user: string;
  db_host: string;
}
export interface RemoteDBAuthProps {
  local_or_remote: "remote";
  connection_url: string;
}

export type DbAuthProps = LocalDBAuthProps | RemoteDBAuthProps;

export function setPGCookie(ctx: RequestContext<unknown>, value: string) {
  ctx?.setCookie("pg_cookie", value, {
    sameSite: "strict",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  // console.log( " ============= set pg cookie  ============ ", ctx.cookie?.pg_cookie);
}
export function deletePGCookie(ctx: RequestContext<unknown>) {
  ctx?.deleteCookie("pg_cookie", {
    path: "/",
  });
  // console.log( " ============= deleted pg cookie  ============ ", ctx.cookie?.pg_cookie);
}
```


And with that we have a basic PostgresSQL GUI hat generates TypeORM and TypeGraphQl classes for us ,    I feel like this will come in handy soon 😏 . feel free to play with it and discover new patterns 

Next step is using something like [wails](https://wails.io/) or [tauri](https://tauri.app/) or [electron](https://www.electronjs.org/) to package it into a binary for better DX

[Full code](https://github.com/tigawanna/postbase)

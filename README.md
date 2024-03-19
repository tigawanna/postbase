# POSTBASE
An attempt at a Nodejs based PostgresSQL GUI

![Main postbase image](https://github.com/tigawanna/postbase/blob/main/public/docs/postbase.jpg)


### Getting started
- clone locally 
- have a running Postgres server
- make sure you have a default Postgres with the settings


 ```ts
postgres({
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "postgres",
      })
 ```

 Connection url can be used but types generation only works on local database

 ```sh 
  npm install
  npm run dev
 ```
for best results build and run it first

```sh
npm run build
npm start
```

To use the TypeORM + TypeGraphQL classes add an environment variable with your [Gemini API key](https://makersuite.google.com/app/apikey), its free for simple uses.


https://github.com/tigawanna/postbase/assets/72096712/50ff037e-7364-46ec-a226-e143aa583be4

The output types and classes are stored in the
[ pg directory](pg)
### built using 
- [Rakkasjs](https://rakkasjs.org/) Vite frontend + Nodejs backend + useServerSideQuery data fetching hooks
- [Shadcn/UI +  Tailwindcss](https://ui.shadcn.com/) Stylings and components
- [Postgresjs](https://github.com/porsager/postgres): low level ORM for PostgresSQL
- [kanel](https://github.com/kristiandupont/kanel): Tool for generating typescript types from Postgres 
- [Gemini AI](https://ai.google.dev/) To generate TypeORM + TypeGraphQL classes 

- [Shikiji](https://shikiji.netlify.app/) Syntax highlighter , used to style the code blocks
![Shikiji highlighted code]([image.png](https://github.com/tigawanna/postbase/blob/main/public/docs/shikiji-code.jpg))

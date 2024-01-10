# POSTBASE
An attempt at a nodejs based postgres GUI

to run 
- clone locally 
- have a running postgres server
- make sure you have a default postgres db with the settings

 ```ts
postgres({
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "postgres",
      })
 ```

built using 
- rakkasjs vite frontend + nodejs backend + useServerSideQuery data fetching hooks
- postgres: low level ORM for postgres

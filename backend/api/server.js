import Hapi from "hapi";

const server = new Hapi.Server({
  host: "0.0.0.0",
  port: "8080",
  routes: {
    cors: { origin: "ignore" },
    payload: { output: 'stream' },
  },
});

async function main() {
  await server.register([
    {
      plugin: require("./shifts-mock-api"),
      routes: { prefix: "/shifts" },
    },
  ]);

  await server.start();
  
  console.log(
    server.table().map((route) => ({
      method: route.method,
      path: route.path,
    })),
  );

  console.info(
    `✅  API server is listening at ${server.info.uri.toLowerCase()}`,
  );
}

main();

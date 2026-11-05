import Hapi from "hapi";

const server = new Hapi.Server({
  host: "0.0.0.0",
  port: "8080",
  routes: {
    cors: { origin: "ignore" },
    payload: { output: 'stream' },
  },
});

server.ext("onRequest", (request, h) => {
  console.log("INCOMING REQUEST:", request.method, request.path);
  return h.continue;
});
server.ext('onPreAuth', (request, h) => {
  console.log('PRE AUTH:', request.method, request.path);
  return h.continue;
});
server.ext('onPostAuth', (request, h) => {
  console.log('POST AUTH:', request.method, request.path);
  return h.continue;
});
server.ext('onPreHandler', (request, h) => {
  console.log('PRE HANDLER:', request.method, request.path);
  return h.continue;
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

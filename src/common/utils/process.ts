process.on("syntaxError", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Syntax Error`);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`StackTrace: ${err.stack}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

process.on("unhandledRejection", (reason: Record<string, string>, _promise) => {
  console.log("Unhandled Rejection =>\n", reason.stack || reason);
  console.log(`Error: ${reason.message}`);
  console.log(`Shutting down the server due to Unhandled Rejection`);
  process.exit(1);
});

process.on("doesNotExist", (reason, _promise) => {
  console.log("doesNotExist Rejection at:", reason.stack || reason);
  console.log(`Error: ${reason.message}`);
  console.log(`Shutting down the server due to doesNotExist Rejection`);
  process.exit(1);
});

process.on("ServiceUnavailableError", (reason, _promise) => {
  console.log("ServiceUnavailableError Rejection at:", reason.stack || reason);
  console.log(`Error: ${reason.message}`);
  console.log(
    `Shutting down the server due to ServiceUnavailableError Rejection`
  );
  process.exit(1);
});

process.on(
  "UnhandledPromiseRejectionWarning",
  (reason: Record<string, string>) => {
    console.log("[UnhandledPromiseRejectionWarning]:", reason.stack || reason);
  }
);

process.on("exit", (code) => {
  console.log(`About to exit with code: ${code}`);
  process.exit(1);
});

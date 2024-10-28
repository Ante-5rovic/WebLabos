process.on('exit', () => {
//   console.log('Proces završava. Zatvaranje pool-a...');
//   closePool();
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT primljen. Zatvaranje pool-a...');
//   closePool();
//   server.close(() => {
//     console.log("Server zatvoren.");
//     process.exit();
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('SIGTERM primljen. Zatvaranje pool-a...');
//   closePool();
//   server.close(() => {
//     console.log("Server zatvoren.");
//     process.exit();
//   });
// });
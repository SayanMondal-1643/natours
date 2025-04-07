const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥. Shuting down...');
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});

const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Database connected successfully');
});
const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!💥. Shuting down...');
  console.log(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('💀 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥Process terminated!');
    process.exit(0);
  });
});

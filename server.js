const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥. Shuting down...');
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

mongoose.connect('mongodb://127.0.0.1:27017/natours').then(() => {
  console.log('Database connected successfully');
});
const port = process.env.PORT;

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!💥. Shuting down...');
  console.log(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

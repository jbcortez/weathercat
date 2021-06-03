var dotenv = require('dotenv');
dotenv.load();

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

console.log(result.parsed);

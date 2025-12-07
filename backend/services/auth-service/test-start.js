require('dotenv').config();

console.log('Environment variables loaded');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

console.log('\nAttempting to load TypeScript...');

try {
  require('ts-node/register/transpile-only');
  console.log('TypeScript loader registered');
  
  console.log('\nAttempting to load index.ts...');
  require('./src/index.ts');
} catch (error) {
  console.error('ERROR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

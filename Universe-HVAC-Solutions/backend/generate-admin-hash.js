/**
 * Generates a bcrypt hash for use as ADMIN_PASSWORD_HASH in backend/.env.
 *
 * Usage (run from inside the backend/ folder, after `npm install`):
 *   node generate-admin-hash.js "YourStrongPassword123"
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-admin-hash.js "YourStrongPassword123"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to your backend/.env file:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

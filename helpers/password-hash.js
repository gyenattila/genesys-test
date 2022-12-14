const bcrypt = require('bcryptjs');

/**
 * Generates a hashed password from 'password'.
 */
(async () => {
  const hashedPsd = await bcrypt.hash('password', 12);
  console.log(hashedPsd);
})();

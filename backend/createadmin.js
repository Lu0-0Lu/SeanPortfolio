const bcrypt = require('bcrypt');
const db = require('./db');

async function setupAdmin() {
  const username = 'sean_admin';
  const plainTextPassword = 'ILoveYou1030'; // <-- Put your new password here

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    // Notice the "DO UPDATE SET" at the end of this query!
    await db.query(
      `INSERT INTO users (username, password_hash) 
       VALUES ($1, $2) 
       ON CONFLICT (username) 
       DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hashedPassword]
    );

    console.log(`✅ Password for '${username}' has been successfully updated!`);
  } catch (err) {
    console.error('❌ Error updating admin:', err);
  } finally {
    process.exit();
  }
}

setupAdmin();
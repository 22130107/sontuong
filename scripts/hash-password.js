const bcrypt = require('bcryptjs');

const password = 'admin'; // Đổi password ở đây
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hashed:', hash);
  console.log('\nSQL để insert vào database:');
  console.log(`INSERT INTO admin_users (username, password, email, created_at) VALUES ('admin', '${hash}', 'admin@example.com', NOW());`);
});

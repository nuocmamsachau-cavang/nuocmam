import mysql from 'mysql2/promise';
import crypto from 'crypto';

async function initAdmin() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    function hashPassword(password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      return `${salt}:${hash}`;
    }

    const adminPassword = hashPassword('nuocmamcavang123');
    
    // Insert admin user
    await connection.execute(
      'INSERT INTO adminUsers (username, passwordHash, email, isActive) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE passwordHash = ?',
      ['GOSA', adminPassword, 'admin@nuocmamcavang.com', true, adminPassword]
    );
    
    console.log('✅ Admin user created/updated successfully');
    console.log('📝 Username: GOSA');
    console.log('🔑 Password: nuocmamcavang123');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initAdmin();

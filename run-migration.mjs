import mysql from 'mysql2/promise';
import fs from 'fs';

async function runMigration() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    // Read SQL file
    const sql = fs.readFileSync('drizzle/0001_easy_red_wolf.sql', 'utf8');
    
    // Split by statement-breakpoint
    const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s);
    
    console.log(`Running ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      try {
        await connection.execute(statement);
        console.log('✅ Executed statement');
      } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log('⚠️ Table already exists');
        } else {
          console.error('❌ Error:', err.message);
        }
      }
    }
    
    console.log('✅ Migration completed');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();

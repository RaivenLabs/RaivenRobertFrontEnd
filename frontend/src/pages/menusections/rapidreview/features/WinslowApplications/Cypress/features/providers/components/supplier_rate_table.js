// api/create-provider-rate-table.js

import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { providerId, rateCardId, columnDefinitions, rateItems } = req.body;

    // Validate required parameters
    if (!providerId || !rateCardId || !columnDefinitions || !rateItems || !Array.isArray(rateItems)) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Start a database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 1. Create the rate card record if it doesn't exist
      const rateCardResult = await client.query(
        'SELECT id FROM rate_cards WHERE id = $1',
        [rateCardId]
      );

      if (rateCardResult.rows.length === 0) {
        await client.query(
          'INSERT INTO rate_cards (id, provider_id, created_at) VALUES ($1, $2, NOW())',
          [rateCardId, providerId]
        );
      }

      // 2. Format column definitions for the create_provider_rate_table function
      const columnArray = [];
      for (const col of columnDefinitions) {
        columnArray.push(col.sql_column);
        columnArray.push(col.sql_type);
      }

      // 3. Call the function to create the dynamic table
      const tableResult = await client.query(
        'SELECT create_provider_rate_table($1, $2, $3) as table_name',
        [providerId, rateCardId, columnArray]
      );
      
      const tableName = tableResult.rows[0].table_name;

      // 4. Generate and execute the INSERT statements for the rate items
      for (const item of rateItems) {
        // Build the dynamic INSERT statement
        const columns = Object.keys(item)
          .filter(key => columnDefinitions.some(col => col.original_name === key))
          .map(key => {
            // Find the corresponding SQL column name
            const colDef = columnDefinitions.find(col => col.original_name === key);
            return colDef ? colDef.sql_column : null;
          })
          .filter(Boolean); // Remove any null values
        
        const values = Object.keys(item)
          .filter(key => columnDefinitions.some(col => col.original_name === key))
          .map(key => item[key]);
        
        const placeholders = values.map((_, i) => `$${i + 2}`).join(', ');
        
        const insertQuery = `
          INSERT INTO ${tableName} 
          (rate_card_id, ${columns.join(', ')})
          VALUES 
          ($1, ${placeholders})
        `;
        
        await client.query(insertQuery, [rateCardId, ...values]);
      }

      // Commit the transaction
      await client.query('COMMIT');
      
      // Return success response
      return res.status(200).json({
        success: true,
        rateCardId: rateCardId,
        tableName: tableName,
        totalProcessed: rateItems.length
      });
      
    } catch (error) {
      // Rollback the transaction if any error occurred
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}

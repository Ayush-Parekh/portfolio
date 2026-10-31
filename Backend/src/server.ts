import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Portfolio REST API is active in ${env.NODE_ENV} mode on http://localhost:${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

// Graceful Shutdown Handler
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Commencing graceful server shutdown...`);

  server.close(async () => {
    console.log('🔒 Closed all incoming HTTP connections.');
    try {
      await pool.end();
      console.log('📦 PostgreSQL connection pool successfully terminated.');
      process.exit(0);
    } catch (err) {
      console.error('⚠️ Error closing database pool during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    console.error('⏱️ Shutdown timed out after 10s. Forcing exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));


-- WhatsApp Bot Multi-Tenant - MySQL Database Initialization
-- This script creates all necessary databases for the microservices

-- Create databases for each service
CREATE DATABASE IF NOT EXISTS wspbot_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS wspbot_tenants CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS wspbot_turns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS wspbot_notifications CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS wspbot_analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to wspbot user
GRANT ALL PRIVILEGES ON wspbot_auth.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_tenants.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_turns.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_notifications.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_analytics.* TO 'wspbot'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES LIKE 'wspbot_%';

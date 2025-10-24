# MySQL Configuration for WhatsApp Bot Multi-Tenant

## Database Setup

### Development
```bash
# Start MySQL with Docker
docker run -d -p 3306:3306 \
  --name wspbot-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=wspbot \
  -e MYSQL_USER=wspbot \
  -e MYSQL_PASSWORD=password \
  mysql:8.0
```

### Production
```bash
# Use docker-compose
docker-compose up -d mysql
```

## Database Structure

### Services Databases
- `wspbot_auth` - Authentication service
- `wspbot_tenants` - Tenant management
- `wspbot_turns` - Turn management
- `wspbot_notifications` - Notifications
- `wspbot_analytics` - Analytics (optional)

### Connection Details
- **Host**: localhost (dev) / mysql (docker)
- **Port**: 3306
- **User**: wspbot
- **Password**: password
- **Root Password**: rootpassword

## Tools

### phpMyAdmin (Optional)
```bash
docker run -d -p 8080:80 \
  --name wspbot-phpmyadmin \
  --link wspbot-mysql:db \
  phpmyadmin/phpmyadmin
```

### MySQL Workbench
- Host: localhost
- Port: 3306
- Username: wspbot
- Password: password

## Performance Tuning

### MySQL Configuration
```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
query_cache_type = 1
```

### Indexes for Multi-Tenant
```sql
-- Tenant isolation indexes
CREATE INDEX idx_tenant_id ON table_name(tenant_id);
CREATE INDEX idx_tenant_created ON table_name(tenant_id, created_at);
CREATE INDEX idx_tenant_status ON table_name(tenant_id, status);
```

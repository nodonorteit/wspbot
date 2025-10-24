#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting WhatsApp Bot Multi-Tenant Development Environment...\n');

// Services to start
const services = [
  { name: 'WAHA', command: 'docker', args: ['run', '-it', '--rm', '-p', '3000:3000', '--name', 'waha', 'devlikeapro/waha'] },
  { name: 'PostgreSQL', command: 'docker', args: ['run', '-d', '-p', '5432:5432', '--name', 'wspbot-postgres', '-e', 'POSTGRES_DB=wspbot', '-e', 'POSTGRES_USER=postgres', '-e', 'POSTGRES_PASSWORD=password', 'postgres:15-alpine'] },
  { name: 'Redis', command: 'docker', args: ['run', '-d', '-p', '6379:6379', '--name', 'wspbot-redis', 'redis:7-alpine'] },
  { name: 'Auth Service', command: 'npm', args: ['run', 'dev'], cwd: path.join(__dirname, 'services/auth-service') },
  { name: 'WhatsApp Service', command: 'npm', args: ['run', 'dev'], cwd: path.join(__dirname, 'services/whatsapp-service') }
];

// Start services
services.forEach((service, index) => {
  setTimeout(() => {
    console.log(`📦 Starting ${service.name}...`);
    
    const child = spawn(service.command, service.args, {
      cwd: service.cwd || __dirname,
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (error) => {
      console.error(`❌ Error starting ${service.name}:`, error.message);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ ${service.name} exited with code ${code}`);
      }
    });
  }, index * 2000); // Stagger startup
});

// Show URLs after a delay
setTimeout(() => {
  console.log('\n🌐 Services URLs:');
  console.log('├── WAHA API: http://localhost:3000');
  console.log('├── Auth Service: http://localhost:3001');
  console.log('├── WhatsApp Service: http://localhost:3004');
  console.log('├── PostgreSQL: localhost:5432');
  console.log('└── Redis: localhost:6379');
  
  console.log('\n📱 To connect WhatsApp:');
  console.log('1. Go to http://localhost:3000/api/screenshot');
  console.log('2. Scan QR code with your WhatsApp');
  console.log('3. Start using the bot!');
  
  console.log('\n🛑 Press Ctrl+C to stop all services');
}, 10000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  
  // Stop Docker containers
  const stopCommands = [
    ['docker', ['stop', 'waha']],
    ['docker', ['stop', 'wspbot-postgres']],
    ['docker', ['stop', 'wspbot-redis']],
    ['docker', ['rm', 'waha']],
    ['docker', ['rm', 'wspbot-postgres']],
    ['docker', ['rm', 'wspbot-redis']]
  ];
  
  stopCommands.forEach(([command, args]) => {
    spawn(command, args, { stdio: 'ignore' });
  });
  
  process.exit(0);
});

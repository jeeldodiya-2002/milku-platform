const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { initSocket } = require('./config/socket');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const hpp = require('hpp');

// Routes
const adminRoutes = require('./routes/admin/adminRoutes');
const productRoutes = require('./routes/public/productRoutes');
const settingsRoutes = require('./routes/public/settingsRoutes');
const categoryRoutes = require('./routes/public/categoryRoutes');
const customerRoutes = require('./routes/public/customerRoutes');

const path = require('path');
const app = express();
const server = http.createServer(app);

// HIGH-AVAILABILITY SETTINGS
app.set('trust proxy', 1); // Trust first proxy (needed for rate-limiting behind Nginx/Vercel)
app.use(compression()); // Compress all responses

// 1. LOGGING (MORGAN)
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

// 2. SECURITY HEADERS (HELMET)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
}));

// 3. CORS CONFIGURATION
const allowedOrigins = ['https://milkudairy.com', 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// 4. DATA SANITIZATION
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp()); 

// 5. RATE LIMITING
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Try again after 15 minutes.' }
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many enquiries submitted. Please try again later.' }
});

app.use('/api', generalLimiter);
app.use('/api/admin/login', loginLimiter);
// app.use('/api/enquiry', enquiryLimiter); // Apply to specific route when created

// Serve Media Folder for 3D Assets
app.use('/media', express.static(path.join(__dirname, '..', 'media')));

// ROUTE MOUNTING
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);

// HIGH-AVAILABILITY HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    engine: 'Milku Cinematic HA Engine'
  });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  // LOG FAILURE FOR PERMANENT DEBUGGING
  console.error("🔥 HIGH-AVAILABILITY SHIELD BREACHED:");
  console.error(`📍 Path: ${req.path}`);
  console.error(`💣 Error: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: 'High-availability shield intercepted a failure.',
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const { exec } = require('child_process');

// FORCE KILL PROCESS ON PORT 5000 (Windows Optimized)
const killPortProcess = (port) => {
    return new Promise((resolve) => {
        const cmd = `netstat -ano | findstr :${port}`;
        exec(cmd, (err, stdout) => {
            if (stdout) {
                const lines = stdout.split('\n');
                const pids = new Set();
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 4) {
                        const pid = parts[parts.length - 1];
                        if (pid !== '0' && pid !== process.pid.toString()) {
                            pids.add(pid);
                        }
                    }
                });

                pids.forEach(pid => {
                    console.log(`🧨 Terminating zombie process ${pid} on port ${port}...`);
                    exec(`taskkill /F /PID ${pid}`, (killErr) => {
                        if (!killErr) console.log(`✅ Process ${pid} killed.`);
                    });
                });
                
                // Wait slightly for OS to release
                setTimeout(resolve, 1000);
            } else {
                resolve();
            }
        });
    });
};

// INITIALIZE SERVICES WITH ULTRA-RESILIENT PORT BINDING
const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();
        await initSocket(server);

        const PORT = process.env.PORT || 5000;
        
        server.on('error', async (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`⚠️  Port ${PORT} is still locked by a zombie process.`);
                await killPortProcess(PORT);
                console.log('♻️  Retrying port binding...');
                server.listen(PORT);
            } else {
                console.error('❌ SERVER ERROR:', e);
            }
        });

        server.listen(PORT, () => {
            console.log(`\n🚀 MILKU HA ENGINE ONLINE`);
            console.log(`📡 Port: ${PORT}`);
            console.log(`🧠 Cache: Redis Active`);
            console.log(`🔌 Real-time: Socket.io Clustered\n`);
        });
    } catch (err) {
        console.error('❌ ENGINE START FAILURE:', err);
        process.exit(1);
    }
};

startServer();

// GRACEFUL SHUTDOWN HANDLERS
const gracefulShutdown = () => {
  console.log('\n🛑 SHUTTING DOWN MILKU HA ENGINE...');
  server.close(() => {
    console.log('📡 Port 5000 Released.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

process.on('unhandledRejection', (err) => {
  console.log(`\n❌ CRITICAL UNHANDLED REJECTION:`);
  console.error(err.stack || err);
  console.log('----------------------------\n');
});

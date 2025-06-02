import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
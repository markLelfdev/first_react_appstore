import express from 'express';
import cors from 'cors';
import productRoutes from './productapi.js';
// import userRoutes from './routes/users.js';
// import cartRoutes from './routes/cart.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

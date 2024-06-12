import express from 'express';
import cors from 'cors';
import productRoutes from './routes/Productapi.js';
import userRoutes from './routes/User.js';
import cartRoutes from './routes/Cart.js';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Use the routes
app.use('/api/Products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

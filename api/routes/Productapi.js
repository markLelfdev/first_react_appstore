import express from 'express';
import db from '../db.js';
const router = express.Router();
/* ↓ Show data  */
// all product  
router.get('/', async (req, res) => {
    try {
        const product = await db.any('SELECT * FROM products')
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});
// get one product
router.get('/:id',async(req,res) => {
    const {id} = req.params;
    try {
    const product = await db.oneOrNone('SELECT * FROM products where id = $1',[id]);
    if (product){
      res.json(product);
    }else{
      res.status(404).json({error: 'Product not found'});
    }} catch(err){
      res.status(500).json({error: err.message});
    }
});
/* ↓ Create Product  */
router.post('/', async (req, res) => {
    try {
        const product = await db.one('INSERT INTO products (name, price, category, stock, description, image_url) VALUES ($1, $2, $3,$4, $5, $6) RETURNING *', 
            [req.body.name, req.body.price, req.body.category, req.body.stock, req.body.description, req.body.image_url]);
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/* ↓ Edit Product  */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, stock, description, image_url } = req.body;
    // console.log(`Received PUT request for id ${id} with data: `, req.body);
    try {
        const updatedProduct = await db.one(
            'UPDATE products SET name = $1, price = $2, category = $3, stock = $4, description = $5, image_url = $6 WHERE id = $7 RETURNING *', 
            [name, price, category, stock, description, image_url,id]);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/* ↓ Delete Product  */
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const deletedProduct = await db.one('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

export default router;

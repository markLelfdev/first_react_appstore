import express from 'express';
import db from '../db.js';
const router = express.Router();
// สร้างตะกร้า
router.post('/',async(req,res)=> {
    const {userid} = req.body;
    try{
        const checkcart = await db.oneOrNone(
            'SELECT * FROM public.carts WHERE userid = $1',
            [userid]
        )
        if (checkcart == null) {
            const result = await db.one(
                'INSERT INTO public.carts( userid, createdat) VALUES ($1, now()) RETURNING cartid',
                [userid]
            );
        res.status(201).json(result);

        }else{
            const result = await db.one(
                'UPDATE public.carts SET createdat = now() WHERE userid = $1 RETURNING cartid',
                [userid]
            );
        res.status(201).json(result);
        }
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// เพิ่มสินค้าในตะกร้า
router.post('/:cartid/items', async (req, res) => {
    const { cartid } = req.params;
    const { productid, quantity } = req.body;
    try {
            // ตรวจสอบว่า quantity มีค่าและไม่ใช่ null
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }
        console.log('cartid:', cartid, 'productid:', productid,'QTY:', quantity);
        const pd_id = await db.oneOrNone(
            'SELECT * FROM public.cartitems WHERE productid = $1 AND cartid = $2 ',
            [productid,cartid]
        );
        // console.log(pd_id);
        if (pd_id != null) {
            await db.none(
                'UPDATE public.cartitems SET quantity = quantity + $1 WHERE cartid = $2 AND productid = $3;',
                [quantity, cartid, productid]
            );
            res.status(204).json({ message: 'Item updated successfully' });
        }else{
            console.log("No")
            const result = await db.one(
                'INSERT INTO public.cartitems(cartid, productid, quantity) VALUES ($1, $2, $3) RETURNING cartitemid',
                [cartid, productid, quantity]
            );
        res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ดูรายการสินค้าทั้งหมดในตะกร้า
router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const sql  = `
        SELECT ci.productid, ci.productid,p.image_url,p.name, p.price, ci.quantity
        FROM public.cartitems ci
        JOIN public.products p ON ci.productid = p.id
        WHERE ci.cartid = $1
      `;
        const items = await db.any(sql,[cartId]);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ลบสินค้าจากตะกร้า
router.delete('/:cartId/items/:itemId', async (req, res) => {
    const { cartId, itemId } = req.params;
    try {
        await db.none(
            'DELETE FROM public.cartitems WHERE cartid = $1 AND productid = $2',
            [cartId, itemId]
        );
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// อัพเดทสินค้าจากตะกร้า
router.put('/:cartId/items/:itemId', async (req, res) => {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    try {
        await db.none(
            'UPDATE public.cartitems SET quantity = $1 WHERE cartid = $2 AND productid = $3;',
            [quantity, cartId, itemId]
        );
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

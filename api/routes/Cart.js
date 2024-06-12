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
router.post('/:cartid/items',async(req,res)=>{
    const {CartID} = req.params;
    const {ProductID, Quantity} = req.body;
    try{
        const result = await db.one(
            'INSERT INTO public.cartitems( cartid, productid, quantity) VALUES ($1,$2,$3) RETURNING itemid'
            [CartID],[ProductID],[Quantity]
        );
        res.status(201).json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;

import express from 'express';
import db from '../db.js'; // Assuming you have a db.js file to handle the connection
const router = express.Router();

/* ↓ Register User */
router.post('/register', async (req, res) => {
    const { username, password, name, lname, email, address, lvl } = req.body; // Changed to req.body

    const client = await db.connect();
    if (!username || !password || !name || !lname || !email || !address || !lvl) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await client.query('BEGIN'); // Begin transaction
        console.log("Transaction started"); // Debug log
        // Insert into user_details table and get the id
        const userDetailQuery = 'INSERT INTO user_details (name, lastname, email, address, date_created) VALUES ($1, $2, $3, $4, now()) RETURNING id';
        const userDetailValues = [name, lname, email, address];
        const userDetailResult = await client.query(userDetailQuery, userDetailValues);
        const userDetailId = userDetailResult[0].id;
        const userAuthQuery = 'INSERT INTO public.user_auth (password, level, data_personal, user_name) VALUES ($1, $2, $3, $4)';
        const userAuthValues = [password, lvl, userDetailId, username];
        const userAuthResult = await client.query(userAuthQuery, userAuthValues);
        // console.log("userAuthResult:", userAuthResult); // Debug log
        
        if (!userAuthResult) {
            throw new Error("Failed to insert into user_auth");
        }
        await client.query('COMMIT'); 
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction
        console.error("Error:", err.message); // Debug log
        res.status(500).json({ error: err.message });
    } 
});

export default router;

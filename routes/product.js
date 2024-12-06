const express = require('express')
const router = express.Router()

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',    // ชื่อผู้ใช้ของฐานข้อมูล
    host: 'localhost',        // ที่อยู่เซิร์ฟเวอร์ (Localhost)
    database: 'Pramoon',// ชื่อฐานข้อมูล
    password: 'password',// รหัสผ่าน
    port: 5432,               // พอร์ตค่าเริ่มต้นของ PostgreSQL
});

pool.connect((err) => {
    if (err) {
        console.error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', err);
        return;
    }
    console.log('เชื่อมต่อฐานข้อมูล PostgreSQL สำเร็จ');
});

router.get("/History", (req, res) => {
    const userId = req.session.user.id;

    const sql = `
        SELECT 
            g.*,
            COALESCE(MAX(b.amount), g.start_price) AS max_bid_amount
        FROM 
            games g
        LEFT JOIN 
            bid b ON g.game_id = b.game_id
        WHERE 
            b.user_id = $1
        GROUP BY 
            g.game_id
    `;

    pool.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send('เกิดข้อผิดพลาดในการ query');
        }

        res.render("myProduct", { games: result.rows });
    });
});



router.get("/sellProduct", (req, res) => {
    res.render("sellProduct")

})


router.post("/sellProduct", (req, res) => {
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const startingPrice = req.body.startingPrice;
    const endTime = req.body.endTime;
    const [date, time] = endTime.split('T');
    const owner = req.session.user.id;


    const sql = "INSERT INTO games (title, description, start_price, end_date, end_time, owner) VALUES($1, $2, $3, $4, $5 , $6)";

    pool.query(sql, [productName, productDescription, startingPrice, date, time, owner], (err, result) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการ INSERT:', err);
            return res.status(500).send('เกิดข้อผิดพลาด');
        }
        res.redirect("/product");
        // res.send(date +" "+ time);
    });


})




router.get("/", (req, res) => {
    const sql = `
    SELECT 
        g.*, 
        COALESCE(MAX(b.amount), g.start_price) AS max_bid_amount
    FROM 
        games g
    LEFT JOIN 
        bid b ON g.game_id = b.game_id
    GROUP BY 
        g.game_id
    `;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send('Internal Server Error');
        }

        res.render("index", { games: result.rows });
    });
});
router.get("/:id", (req, res) => {


    const sql = `
        SELECT 
            g.*, 
            MAX(b.amount) AS max_bid_amount
        FROM 
            games g
        LEFT JOIN 
            bid b 
        ON 
            g.game_id = b.game_id
        WHERE 
            g.game_id = $1
        GROUP BY 
            g.game_id
    `;
    pool.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("error")
            return res.status(500).send('error');
        }

        res.render("product", { games: result.rows });
    })
})

router.post("/:id", async (req, res) => {
    try {
        const amount = parseInt(req.body.amount);
        const game = req.params.id;
        const user_id = req.session?.user?.id;

        // ตรวจสอบว่า user login หรือไม่
        if (!user_id) {
            return res.status(401).send("Unauthorized: Please log in first.");
        }

        // Query เพื่อดึงข้อมูลการประมูลล่าสุด
        const maxBidResult = await pool.query(
            "SELECT MAX(amount) AS max_bid_amount FROM bid WHERE game_id = $1",
            [game]
        );
        const maxBidAmount = maxBidResult.rows[0]?.max_bid_amount || 0;

        // Query เพื่อดึงข้อมูล end_date และ end_time
        const dateResult = await pool.query(
            "SELECT end_date, end_time FROM games WHERE game_id = $1",
            [game]
        );
        if (dateResult.rows.length === 0) {
            return res.status(404).send("Game not found.");
        }

        const { end_date, end_time } = dateResult.rows[0];
        const isoDate = new Date(end_date);
        const formattedDate = isoDate.toISOString().split("T")[0];
        const combinedDateTime = new Date(`${formattedDate}T${end_time}`);

        // ตรวจสอบว่าหมดเวลาประมูลหรือยัง
        const currentDateTime = new Date();
        if (currentDateTime > combinedDateTime) {
            return res.status(400).send(`
                <script>
                    alert('การประมูลสิ้นสุดลงเเล้ว');
                    setTimeout(() => {
                        window.location.href = '/product/${game}';
                    }, 1000);
                </script>
            `);
        }

        // ตรวจสอบว่าเงินผู้ใช้เพียงพอหรือไม่
        const moneyResult = await pool.query(
            "SELECT money FROM customer WHERE user_id = $1",
            [user_id]
        );
        if (moneyResult.rows.length === 0) {
            return res.status(404).send("User not found.");
        }

        const userMoney = parseInt(moneyResult.rows[0]?.money || 0);
        if (userMoney < amount) {
            return res.status(400).send(`
                <script>
                    alert('จำนวนเงินไม่พอ');
                    setTimeout(() => {
                        window.location.href = '/product/${game}';
                    }, 1000);
                </script>
            `);
        }

        // ตรวจสอบว่าจำนวนเงินประมูลมากกว่าประมูลสูงสุดหรือไม่
        if (amount <= maxBidAmount) {
            return res.status(400).send(`
                <script>
                    alert('กรุณาใส่จำนวนเงินให้มากกว่าจำนวนปัจจุบัน');
                    setTimeout(() => {
                        window.location.href = '/product/${game}';
                    }, 1000);
                </script>
            `);
        }

        // Insert ข้อมูลการประมูล
        await pool.query(
            "INSERT INTO bid (user_id, game_id, amount) VALUES ($1, $2, $3)",
            [user_id, game, amount]
        );

        // หักเงินผู้ใช้
        const newBalance = userMoney - amount;
        await pool.query(
            "UPDATE customer SET money = $1 WHERE user_id = $2",
            [newBalance, user_id]
        );

        // Redirect กลับไปยังหน้าสินค้า
        res.redirect(`/product/${game}`);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Server error");
    }
});







module.exports = router
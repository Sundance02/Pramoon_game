const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key', 
    resave: false,             
    saveUninitialized: false,  
    cookie: {                  
        maxAge: 1000 * 60 * 60 * 24 
    }
}));




app.set('view engine', 'ejs'); // กำหนดให้ใช้ EJS
app.set('views', './views');  // กำหนดโฟลเดอร์สำหรับเก็บไฟล์ EJS

app.use(express.static('static'));

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





app.get("/", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/profile", (req, res) => {
    const id = req.session.user.id;
    const sql = "SELECT * FROM customer where user_id = $1";
    pool.query(sql,[id] ,(err, result)=> {
        if(err){
            console.error("error")
            return res.status(500).send('error');
        }
        res.render("profile", {profile:result.rows})
        // res.send(id)
    })
})

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const sql = "SELECT * FROM customer where username = $1 AND password = $2 ";

    pool.query(sql,[username, password] ,(err, result)=> {
        if(err){
            console.error("error")
            return res.status(500).send('error');
        }

        if(result.rows.length > 0 ){
            req.session.user = { 
                id: result.rows[0].user_id, 
                username: result.rows[0].username,
                money: result.rows[0].money
            };
            res.redirect("/product")
        }
        else{
            res.redirect("/login")
        }

    })
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const money = 1000000.00;

    const sql = "INSERT INTO customer (username, password, money) VALUES($1, $2, $3)";

    pool.query(sql, [username, password, money], (err, result) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการ INSERT:', err);
            return res.status(500).send('เกิดข้อผิดพลาด');
        }
        res.redirect("/");
    });
});

const userRouter = require('./routes/product')

app.use('/product', userRouter)


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
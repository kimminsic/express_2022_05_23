//app.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "a1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();

const corsOptions = {
  origin: 'https://cdpn.io',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use(cors(corsOptions));



const port = 3000;

app.patch("/todos/:id", async(req, res)=>{
  const { id } = req.params ;

  const [rows] = await pool.query(`SELECT * FROM todo WHERE id =?`,[id]);

if (rows.length == 0){
  res.status(404).json({
    msg:"not found",
    
  });
  return;
}
const { perform_date, content } = req.body;

if(!perform_date){
  res.status(400).json({
    msg : "perform_date required",
  });
  return;
}
if(!content){
  res.status(400).json({
    msg : "content required",
  });
  return;
}

const [rs] = await pool.query(
  `
  UPDATE todo
  SET perform_date = ?,
  content = ?
  WHERE id = ? 
  `,
  [perform_date, content, id]
);

res.json({
  msg : `${id}번 할일이 수정되었습니다.`,
});
});

app.delete("/todos/d/:id", async(req, res)=>{
  const { id } = req.params ;
  const [rows] = await pool.query(`SELECT * FROM todo WHERE id =?`,[id]);

  if (rows.length == 0){
    res.status(404).json({
      msg:"not found",});
      return;
    }

    const [rs] = await pool.query(
      `
      DELETE FROM todo 
      WHERE id=?
      `,
      [id]
    );
    
    res.json(`${id}번이 삭제되었습니다.`);
});
app.post("/todos/", async(req, res)=>{

const { perform_date, content } = req.body;

if(!perform_date){
  res.status(400).json({
    msg : "perform_date required",
  });
  return;
}
if(!content){
  res.status(400).json({
    msg : "content required",
  });
  return;
}

const [rows] = await pool.query(
  `
  INSERT INTO todo
  SET reg_date = NOW(),
  perform_date = ?,
  content = ?
  `,
  [perform_date, content]
);

res.json({
  msg : `생성되었습니다.`,
});
});

app.get("/todos",async (req, res) => {
const [rows] = await pool.query("SELECT * FROM todo ORDER BY id DESC");

res.json(rows);
});

app.get("/todos/:id",async (req, res) => {
  const { id } = req.params ;
  const [rows] = await pool.query(`SELECT * FROM todo WHERE id =?`,[id]);

if (rows.length == 0){
  res.status(404).json({
    msg:"not found",
    
  });
  return;
}

res.json(rows[0]);
});

app.listen(port);
import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./router/user.js";
import FAQRouter from "./router/FAQ.js";
import managerRouter from "./router/manager.js"
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { db } from "./db/database.js";
import requestRouter from "./router/request.js";
import authRouter from "./router/auth.js"
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny")); // 사용자들이 들어오게되면 로그를 콘솔에 찍어줌



app.get('/api/user_answers', async (req, res, next) => {
  try {
    // 데이터베이스에서 사용자 정보 가져오기
    const [rows] = await db.query('SELECT * FROM able.User_answer');

    // 사용자 정보를 JSON 형식으로 응답
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// /api/users/:id 경로에 대한 GET 요청 처리
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // 데이터베이스에서 해당 ID의 사용자 정보를 조회합니다.
    const user = await db.query('SELECT * FROM able.User_info WHERE ui_idx = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user[0]); // 조회된 사용자 정보를 JSON 형식으로 응답합니다.
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});


// /api/users/:id 경로에 대한 PUT 요청 처리
app.put('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { newName, newNumber, newUsername, newPassword } = req.body;

    // 데이터베이스에서 해당 ID의 사용자 정보를 조회합니다.
    const user = await db.query('SELECT * FROM able.User_info WHERE ui_idx = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    // 사용자 정보 업데이트
    await db.query('UPDATE able.User_info SET ui_name = ?, ui_hp = ?, ui_userid = ?, ui_password = ? WHERE ui_idx = ?', [newName, newNumber, newUsername, hashed, id]);

    // 업데이트된 사용자 정보를 조회합니다.
    const updatedUser = await db.query('SELECT * FROM able.User_info WHERE ui_idx = ?', [id]);
    res.json(updatedUser[0]); // 업데이트된 사용자 정보를 JSON 형식으로 응답합니다.
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});



app.get('/api/managers', async (req, res, next) => {
  try {
    // 데이터베이스에서 사용자 정보 가져오기
    const [rows] = await db.query('SELECT * FROM able.Manager_info');

    // 사용자 정보를 JSON 형식으로 응답
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



//api/answer/:id 경로에 대한 GET 요청 처리
app.get('/api/answer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // 데이터베이스에서 해당 ID의 사용자 정보를 조회합니다.
    const user = await db.query('SELECT * FROM  able.User_answer WHERE ua_idx = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user[0]); // 조회된 사용자 정보를 JSON 형식으로 응답합니다.
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});


// /api/answer/:id 경로에 대한 PUT 요청 처리
app.put('/api/answer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { newName, mi_userid } = req.body;

    // 데이터베이스에서 해당 ID의 사용자 정보를 조회합니다.
    const user = await db.query('SELECT * FROM able.User_answer WHERE ua_idx = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보 업데이트
    await db.query('UPDATE able.User_answer SET ua_answer = ?,mi_name= ?, ua_resolution= ? WHERE ua_idx = ?', [newName, mi_userid, '0', id]);

    // 업데이트된 사용자 정보를 조회합니다.
    const updatedUser = await db.query('SELECT * FROM User_answer WHERE ua_idx = ?', [id]);
    res.json(updatedUser[0]); // 업데이트된 사용자 정보를 JSON 형식으로 응답합니다.
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});




// /api/users 경로에 대한 GET 요청 처리
app.get('/api/users', async (req, res, next) => {
  try {
    // 데이터베이스에서 사용자 정보 가져오기
    const [rows] = await db.query('SELECT * FROM able.User_info');

    // 사용자 정보를 JSON 형식으로 응답
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/api/faq/add", async (req, res) => {
  try {
    const { mi_name, fi_detail, fi_answer } = req.body;

    // FAQ 정보를 데이터베이스에 추가합니다.
    await db.query(
      "INSERT INTO able.FAQ_info (fi_detail, mi_name, fi_answer) VALUES (?, ?, ?)",
      [fi_detail, mi_name, fi_answer]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// /api/faqs/:id 경로에 대한 GET 요청 처리
app.get('/api/faqs/:id', async (req, res) => {
  try {
    const faqId = req.params.id;

    // 데이터베이스에서 해당 ID의 FAQ 정보를 조회합니다.
    const [rows] = await db.query('SELECT * FROM able.FAQ_info WHERE fi_idx = ?', [faqId]);

    // FAQ 정보를 JSON 형식으로 응답합니다.
    if (rows.length === 0) {
      return res.status(404).json({ message: 'FAQ를 찾을 수 없습니다.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// FAQ 목록 조회 API
app.get('/api/faqs', async (req, res, next) => {
  try {
    // 데이터베이스에서 FAQ 정보를 가져옵니다.
    const [rows] = await db.query('SELECT * FROM able.FAQ_info');

    // FAQ 정보를 JSON 형식으로 응답합니다.
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



// FAQ 수정 API
app.put('/api/faqs/:id', async (req, res) => {
  try {
    const faqId = req.params.id;
    const { newDetail, newManagerName, newAnswer } = req.body;

    // 데이터베이스에서 해당 ID의 FAQ 정보를 조회합니다.
    const [rows] = await db.query('SELECT * FROM able.FAQ_info WHERE fi_idx = ?', [faqId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'FAQ를 찾을 수 없습니다.' });
    }

    // FAQ 정보 업데이트
    await db.query('UPDATE able.FAQ_info SET fi_detail = ?, mi_name = ?, fi_answer = ? WHERE fi_idx = ?', [newDetail, newManagerName, newAnswer, faqId]);

    // 업데이트된 FAQ 정보를 조회합니다.
    const updatedFAQ = await db.query('SELECT * FROM able.FAQ_info WHERE fi_idx = ?', [faqId]);
    res.json(updatedFAQ[0]); // 업데이트된 FAQ 정보를 JSON 형식으로 응답합니다.
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// FAQ 삭제 API
app.delete('/api/faqs/:id', async (req, res) => {
  try {
    const faqId = req.params.id;

    // 데이터베이스에서 해당 ID의 FAQ 정보를 조회합니다.
    const [rows] = await db.query('SELECT * FROM able.FAQ_info WHERE fi_idx = ?', [faqId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'FAQ를 찾을 수 없습니다.' });
    }

    // FAQ 정보 삭제
    await db.query('DELETE FROM able.FAQ_info WHERE fi_idx = ?', [faqId]);

    res.sendStatus(204); // 성공적으로 삭제되었음을 응답합니다.
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



// 유저 관리
app.use("/user", userRouter);

// 관리자 정보 관리
app.use("/manager", managerRouter);

// FAQ 관리
app.use("/FAQ", FAQRouter)

// 문의 관리
app.use("/request", requestRouter)

app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});


const sever = app.listen(config.host.port);
initSocket(sever);




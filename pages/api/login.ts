import { NextApiRequest, NextApiResponse } from "next";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";

// 設定資料庫路徑
const dbFile = path.join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<{ users: { email: string; password: string }[] }>(dbFile);
const db = new Low(adapter, { users: [] });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // 載入資料庫
    await db.read();

    // 如果資料庫為空，初始化資料結構
    if (!db.data) {
      db.data = { users: [] };
      await db.write();
    }

    console.log("Database content:", db.data);

    // 檢查使用者是否存在
    const user = db.data.users.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (user) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

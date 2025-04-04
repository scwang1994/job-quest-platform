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

    if (!db.data) {
      db.data = { users: [] };
    }

    // 檢查是否已存在相同 email 的使用者
    const existingUser = db.data.users.find(
      (u: { email: string }) => u.email === email
    );

    if (existingUser) {
      res.status(400).json({ message: "Email already registered." });
      return;
    }

    // 新增使用者資料
    db.data.users.push({ email, password });
    await db.write();

    res.status(201).json({ message: "Registration successful!" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

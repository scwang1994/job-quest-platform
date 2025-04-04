import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import fs from "fs";
import path from "path";

interface User {
  name: string;
  email: string;
  password: string;
  isVerify: string[];
  isVerified: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const dbPath = path.join(process.cwd(), "data", "db.json");
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    if (!db.users || !Array.isArray(db.users)) {
      return res.status(500).json({ error: "Invalid database structure: 'users' not found" });
    }

    const user = db.users.find((u: User) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    setCookie("name", user.name, { req, res });
    setCookie("email", user.email, { req, res });
    setCookie("isVerifiedLength", user.isVerified.length, { req, res }); // 修正為 isVerified 長度

    return res.status(200).json({ message: "Login successful" });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

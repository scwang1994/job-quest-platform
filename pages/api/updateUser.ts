import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

interface User {
  name: string;
  isVerified?: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  if (req.method === "POST") {
    const dbPath = path.join(process.cwd(), "data", "db.json");
    const { name, isVerified } = req.body;

    try {
      const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

      if (!db.users || !Array.isArray(db.users)) {
        return res.status(500).json({ error: "Invalid database structure: 'users' not found" });
      }

      const userIndex = db.users.findIndex((user: User) => user.name === name);

      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      db.users[userIndex] = {
        ...db.users[userIndex],
        isVerified,
      };

      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update user data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

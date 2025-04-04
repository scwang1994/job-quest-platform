import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      res.status(200).json(data.jobs || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch jobs." });
    }
  } else if (req.method === "POST") {
    try {
      const job = req.body;

      // 讀取現有的資料
      const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      data.jobs = data.jobs || [];

      // 新增工作資料
      data.jobs.push(job);

      // 寫入更新後的資料
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

      res.status(200).json({ message: "Job added successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add job." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

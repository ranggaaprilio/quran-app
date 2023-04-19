import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const request = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const GetSurah = async (id = 0) => {
  try {
    const surahDirectory = path.join(process.cwd(), "data/surah");
    const filePath = path.join(surahDirectory, "list.json");
    let rawdata = await fs.readFileSync(filePath, "utf-8");
    let allSurah = JSON.parse(rawdata);
    return { result: allSurah };
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const Getayat = async (id = 0) => {
  try {
    if (id !== 0) {
      const res = await fetch(`/api/surah/${id}`);
      return res.json();
    }
    return false;
  } catch (error) {
    return error.message;
  }
};

export const GetTodaySchedule = async () => {
  try {
    const res = await request.get(`/api/jadwal/`);
    return res?.data?.result;
  } catch (error) {
    return error.message;
  }
};

export const GetHadits = async (id, pageParam) => {
  try {
    const limit = pageParam + 10;
    const offset = pageParam === 1 ? pageParam : pageParam + 1;

    const page = `${offset}-${limit}`;

    console.log(id, pageParam, page, "check this");
    const res = await request.get(
      `https://api.hadith.gading.dev/books/${id}?range=${page}`
      //   `https://api.hadith.gading.dev/books/abu-daud?range=20-301`
    );
    return res?.data;
  } catch (error) {
    return error.message;
  }
};

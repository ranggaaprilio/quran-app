import fs from "fs";
import path from "path";

//last ayat for every juz

const lastAyat = [
  { juz: 1, surah: 2, ayah: 141 },
  { juz: 2, surah: 2, ayah: 252 },
  { juz: 3, surah: 3, ayah: 92 },
  { juz: 4, surah: 4, ayah: 23 },
  { juz: 5, surah: 4, ayah: 147 },
  { juz: 6, surah: 5, ayah: 81 },
  { juz: 7, surah: 6, ayah: 110 },
  { juz: 8, surah: 7, ayah: 87 },
  { juz: 9, surah: 8, ayah: 40 },
  { juz: 10, surah: 9, ayah: 92 },
  { juz: 11, surah: 11, ayah: 5 },
  { juz: 12, surah: 12, ayah: 52 },
  { juz: 13, surah: 14, ayah: 52 },
  { juz: 14, surah: 16, ayah: 128 },
  { juz: 15, surah: 18, ayah: 74 },
  { juz: 16, surah: 20, ayah: 135 },
  { juz: 17, surah: 22, ayah: 78 },
  { juz: 18, surah: 25, ayah: 20 },
  { juz: 19, surah: 27, ayah: 55 },
  { juz: 20, surah: 29, ayah: 45 },
  { juz: 21, surah: 33, ayah: 30 },
  { juz: 22, surah: 36, ayah: 27 },
  { juz: 23, surah: 39, ayah: 31 },
  { juz: 24, surah: 41, ayah: 46 },
  { juz: 25, surah: 45, ayah: 37 },
  { juz: 26, surah: 51, ayah: 30 },
  { juz: 27, surah: 57, ayah: 29 },
  { juz: 28, surah: 66, ayah: 12 },
  { juz: 29, surah: 77, ayah: 50 },
  { juz: 30, surah: 114, ayah: 6 },
];

export default async (req, res) => {
  if (req.method === "GET") {
    const { id } = req.query;

    const surahDirectory = path.join(process.cwd(), "data/surah");
    const filePath = path.join(surahDirectory, `${id}.json`);
    let rawdata = await fs.readFileSync(filePath, "utf-8");
    let surah = JSON.parse(rawdata);

    //find data if surah has end of juz
    const findLastJuz = lastAyat.filter((v) => +v.surah === +surah.data.number);
    if (findLastJuz.length > 0) {
      surah.data.lastJuz = findLastJuz;
    }
    res.status(200).json({ result: surah });
  }
};

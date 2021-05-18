import fs from "fs";
import path from "path"

export default async(req, res) => {
   if (req.method === 'GET') {
       const {id}=req.query
       console.log(id,'ini id');
       const surahDirectory = path.join(process.cwd(), 'data/surah');
       const filePath = path.join(surahDirectory, `${id}.json`);
       let rawdata = await fs.readFileSync(filePath,'utf-8');
       let surah = JSON.parse(rawdata);
   //  let rawdata = await fs.readFileSync(`data/surah/${id}.json`);
   //  let surah = JSON.parse(rawdata);
    res.status(200).json({result:surah})
   }
}
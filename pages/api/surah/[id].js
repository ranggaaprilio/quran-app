import fs from "fs/promises";

export default async(req, res) => {
   if (req.method === 'GET') {
       const {id}=req.query
       console.log(id,'ini id');
    let rawdata = await fs.readFile(`data/surah/${id}.json`);
    let surah = JSON.parse(rawdata);
    res.status(200).json({result:surah})
   }
}
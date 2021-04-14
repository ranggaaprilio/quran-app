// 'use strict';

import fs from "fs";

export default async(req, res) => {
   if (req.method === 'GET') {
    let rawdata = await fs.readFileSync('data/surah/list.json');
    let surah = JSON.parse(rawdata);
    res.status(200).json({result:surah})
   }
}
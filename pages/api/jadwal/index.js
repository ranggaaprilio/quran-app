require('dotenv').config();
const { DateTime } = require("luxon");

export default async(req, res) => {
   if (req.method === 'GET') {
    try {
        console.log(`https://api.pray.zone/v2/times/day.json?city=jakarta&date=${DateTime.local().setZone('UTC+7').toFormat('yyyy-MM-dd')}`,"process.env.API_SHOLAT")
        const response=await fetch(`https://api.pray.zone/v2/times/day.json?city=jakarta&date=${DateTime.local().setZone('UTC+7').toFormat('yyyy-MM-dd')}`);
        const responseJson=await response.json();
        if (responseJson.code===200) {
            res.status(200).json({data:responseJson}) 
        }else{
            throw new Error(responseJson.message)
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({result:error})
    }
    
   }
}
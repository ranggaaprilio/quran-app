require('dotenv').config();
const { DateTime } = require("luxon");

export default async(req, res) => {
   if (req.method === 'GET') {
    try {
        console.log(`https://api.myquran.com/v1/sholat/jadwal/1301/${DateTime.local().setZone('UTC+7').toFormat('yyyy')}/${DateTime.local().setZone('UTC+7').toFormat('MM')}/${DateTime.local().setZone('UTC+7').toFormat('dd')}`,"process.env.API_SHOLAT")
        
        const response=await fetch(`https://api.myquran.com/v1/sholat/jadwal/1301/${DateTime.local().setZone('UTC+7').toFormat('yyyy')}/${DateTime.local().setZone('UTC+7').toFormat('MM')}/${DateTime.local().setZone('UTC+7').toFormat('dd')}`);
        const responseJson=await response.json();
        
        if (responseJson.status===true) {
            console.log(responseJson.status,"code");
            res.status(200).json({result:responseJson}) 
        }else{
            throw new Error(responseJson.message)
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({result:error})
    }
    
   }
}
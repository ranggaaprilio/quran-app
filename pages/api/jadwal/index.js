require('dotenv').config();
const { DateTime } = require("luxon");

const parseToObject=(tanggal,waktu)=>{
    let tanggalArray=tanggal.split('-');
    let waktuArray=waktu.split(':');
    return {year:tanggalArray[0],month:tanggalArray[1],day:tanggalArray[2],hour:waktuArray[0],minute:waktuArray[1]}
}

const findNowJadwal=(dateAndTime)=>{
    const now=DateTime.local().setZone('UTC+7');
    const imsakObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Imsak);
    const subuhObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Fajr);
    const dzuhurObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Dhuhr);
    const asharObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Asr);
    const maghribObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Maghrib);
    const isyaObject=parseToObject(dateAndTime.results.datetime[0].date.gregorian,dateAndTime.results.datetime[0].times.Isha);

    const imsak=DateTime.fromObject(imsakObject);
    const subuh=DateTime.fromObject(subuhObject);
    const dzuhur=DateTime.fromObject(dzuhurObject);
    const ashar=DateTime.fromObject(asharObject);
    const maghrib=DateTime.fromObject(maghribObject);
    const isya=DateTime.fromObject(isyaObject);

    console.log("compare",now<imsak);
    console.log(now.toFormat('yyyy-MM-dd HH:mm:ss'),"DATE NOW");
    if (now<imsak) {
        return {
            name:'Imsak',
            time:imsak.toFormat('HH:mm')
        }
    } else if (now<subuh) {
        return {
            name:'Subuh',
            time:subuh.toFormat('HH:mm')
        }
    }else if (now<dzuhur) {
        return {
            name:'Dzuhur',
            time:dzuhur.toFormat('HH:mm')
        }
    }else if(now<ashar){
        return {
            name:'Ashar',
            time:ashar.toFormat('HH:mm')
        }
    }else if(now<maghrib){
        return {
            name:'Maghrib',
            time:maghrib.toFormat('HH:mm')
        }
    }else if(now<isya){
        return {
            name:'Maghrib',
        }
    }else{
        return {
            name:'Isya',
            time:isya.toFormat('HH:mm')
        }
    }
}

export default async(req, res) => {
   if (req.method === 'GET') {
    try {
        console.log(`https://api.pray.zone/v2/times/day.json?city=jakarta&date=${DateTime.local().setZone('UTC+7').toFormat('yyyy-MM-dd')}`,"process.env.API_SHOLAT")
        const response=await fetch(`https://api.pray.zone/v2/times/day.json?city=jakarta&date=${DateTime.local().setZone('UTC+7').toFormat('yyyy-MM-dd')}`);
        const responseJson=await response.json();
        responseJson.results.active=findNowJadwal(responseJson);
        responseJson.results.dateNow=DateTime.local().setZone('UTC+7').toFormat('dd MMMM yyyy');
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
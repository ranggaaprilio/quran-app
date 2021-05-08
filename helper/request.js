import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const request = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json'}
});


export const GetSurah=async(id=0)=>{
    try {
        if (id==0){
            const res=await request.get('/api/surah')
            return res.data
        }

        const res=await request.get(`/api/surah/${id}`)
            return res.data
        
    } catch (error) {
        console.log(error);
        return error.message
    }
}
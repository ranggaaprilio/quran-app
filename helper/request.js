import axios from "axios";

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json'}
});


export const GetSurah=async()=>{
    try {
        const res=await request.get('/api/surah')
        return res.data
    } catch (error) {
        console.log(error);
        return error.message
    }
}
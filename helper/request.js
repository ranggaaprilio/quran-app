import axios from "axios";

const request = axios.create({
  baseURL: 'http://localhost:3000',
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
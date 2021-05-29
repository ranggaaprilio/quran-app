import {Fragment,useEffect, useState} from "react"
import Head from "next/head"
import { useRouter } from "next/router";
import {Getayat} from '../../helper/request' 




export default function surah(props) {
  
  const router=useRouter()

  const [Ayat,setAyat]= useState({})
  const [isi,setIsi]= useState([])
  const [arti,setArti]=useState([])
  const [number, setNumber]=useState([])

  useEffect(async() => {
    
    const surah= await Getayat(router.query.id);
    console.log(surah,'ini surah');
  if (surah!=false) {
    let result=surah?.result?.data
    // console.log();
    setAyat(result)
    setIsi(Object.values(result?.text))
    setArti(Object.values(result?.translations?.id.text))
    setNumber(Object.keys(result?.text))
  }
  }, [router])

  const ConvertToArabicNumbers = (num) => {
    const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
   return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
  }

return(
<Fragment>
    <Head>
        <title>{Ayat?.name_latin}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8"/>

      </Head>
    <div class="p-5 mb-4 " style={{backgroundColor:"#c6ffc1"}}>
      <div class="container-fluid py-2">
        <div>
        <div>
        <h1 class="display-5 fw-medium text-green-900 ">{Ayat?.name_latin}({Ayat?.name})</h1>
        <h5 class="fs-3 fw-medium text-green-900 ">Makna: {Ayat?.translations?.id.name}</h5>
        </div>
        <div>
        <h6 class="fs-5 fw-light text-green-900 ">Surah ke- {Ayat?.number}</h6>
        <h6 class="fs-5 fw-light text-green-900 ">Jumlah Ayat ( {Ayat?.number_of_ayah} )</h6>
        </div>
        </div>
       
      </div>
    </div>
    <div>
      {isi.map((v,i)=>(
        <div className="p-3">
       
        <p dir="rtl" lang="ar"className=" fs-1 ms-2 pb-1 pr-5" style={{fontFamily:"Lateef, cursive"}} >{v}  &nbsp;
        <span className="numcontainer">
        
        <img style={{display:"inline-block",height:"60px",width:"60px"}} src="/arabic-design-circular-border-ornamental-round-vector-13473464-removebg-preview.png" alt="border" srcset="" />
        <p className="centered">{ConvertToArabicNumbers(number[i])}</p>

        </span>
        </p>
       
       
        
        <p className=" fs-5 ms-1 p-2">{i+1}.{arti[i]}</p>
        <hr className=" mb-2" style={{borderTop: "1px dashed #34656d"}}/>
        </div>
      ))}
    
    </div>
</Fragment>
)
}

// export async function getStaticProps(context) {
//     const { params } = context;
//     const pid=params.id
//     const surah= await GetSurah(pid);
//     return {
//       props: {
//         list: {surah},
//       },
//     };
//   }

//   export function getStaticPaths() {
//   const newArr=[]
//    for (let index = 1; index <= 114; index++) {
//      newArr.push({params:{id:index.toString()}})
     
//    }
//     return {
//       paths: newArr,
//       fallback: false,
//     };
//   }
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {GetSurah} from '../helper/request' 
import {Fragment, useEffect,useState} from 'react'
import _ from "lodash";

export default function quran(props) {

const [surah,setSurah]= useState([])

  useEffect(() => {
    const{data}=props.list.allSurah.result
    console.log(data,"listing");
    setSurah(data)
  }, [])

  const search=(data='')=>{
    console.log(data,'data');
    const res=props.list.allSurah.result.data
    if (data=='') {
      setSurah(res)
      return false
    }
    let find = _.filter(res,function(item){
      return item.name_latin.toLowerCase().indexOf(data.toLowerCase()) >= 0
    })
    console.log(find);
    setSurah(find)
  }
  
  return (
    <Fragment>
       <Head>
        <title>Quran App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8"/>
      </Head>
      <div className={styles.box}></div>
      <div className={styles.container}>
     
     <main className={styles.main}>
       <div className=" container fixed-top " style={{backgroundColor:"#34656d"}}>
         <h1 className="fs-2 fw-2 my-2 font-custom mb-3 " style={{color:"white"}}>Qur`an App</h1> 
         <input className="form-control mb-3" type="text" placeholder="Cari nama surah" aria-label="default input example" onChange={(e)=>search(e.target.value)}></input>
       </div>
       <div className="container" style={{ marginTop: 111 }}>
       <div className="row">
        {surah.map((v,i)=>(
          
          <Fragment key={i}>
          <div className={surah.length>2?"col-sm-4 mb-2":"col-sm-6 mb-2"} >
             <div className="card" style={{backgroundColor:"#fffbdf",minWidth:"300px"}} >
               <div className="card-body" >
                 <div style={{display:'flex',justifyContent:'space-between'}}>
                 <p  className="card-title" style={{fontFamily:'Amiri'}} >{v.number+'. '}</p>
                 <h4 dir="rtl" lang="ar"className="card-title" style={{fontFamily:'Amiri'}} >
                 <Link href={`/surah/${v.number}`} className={styles.whenhover}>{v.name}</Link></h4>
                 </div>
                
                 <h6 className="card-subtitle mb-2 text-muted"><Link href={`/surah/${v.number}`} className={styles.whenhover} >{v.name_latin}</Link></h6>
                 <p className="card-text" >Jumlah Ayat:&nbsp;{v.number_of_ayah}</p> 
               </div>
             </div>
           </div>
          </Fragment>
     
            
        )
        )}
         
         
         </div>
       </div>
    
     </main>

     <footer className={styles.footer}>
       <a
         href="https://portofolio.devapril.com"
         target="_blank"
         rel="noopener noreferrer"
       >
         Powered by <span className="fw-bold">&nbsp; Rangga Aprilio Utama</span> 
       
       </a>
     </footer>
   </div>
    </Fragment>
   
  )
}

export async function getStaticProps() {
  
  const allSurah= await GetSurah();
  return {
    props: {
      list: {allSurah},
    },
  };
}

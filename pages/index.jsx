import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {GetSurah} from '../helper/request' 
import {Fragment, useEffect,useState} from 'react'

export default function Home(props) {

const [surah,setSurah]= useState([])

  useEffect(() => {
    const{data}=props.list.allSurah.result
    console.log(data,"listing");
    setSurah(data)
  }, [])
  
  return (
    <Fragment>
       <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8"/>
      </Head>
      <div className={styles.box}></div>
      <div className={styles.container}>
     
     <main className={styles.main}>
       <div className=" container fixed-top " style={{backgroundColor:"#51c4d3"}}>
         <h1 className="fs-2 fw-2 my-2 font-custom " style={{color:"white"}}>Qur`an Online</h1>
         <input className="form-control mb-3" type="text" placeholder="Cari nama surah" aria-label="default input example"></input>
       </div>
       <div className="container" style={{ marginTop: 111 }}>
       <div className="row">
        {surah.map((v,i)=>(
          
          <Fragment>
          <div className="col-sm-6 mb-2">
             <div className="card" >
               <div className="card-body">
                 <h4 dir="rtl" lang="ar"className="card-title" style={{fontFamily:'Amiri'}}>{v.name}</h4>
                 <h6 className="card-subtitle mb-2 text-muted"><Link href="/surah/1">{v.name_latin}</Link></h6>
                 <p className="card-text">Jumlah Ayat:&nbsp;{v.number_of_ayah}</p> 
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
         href="https://portofnext.vercel.app"
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

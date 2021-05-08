import {Fragment,useEffect} from "react"
import Head from "next/head"
import { useRouter } from "next/router";
import {GetSurah} from '../../helper/request' 




export default function surah(props) {
  
  const router=useRouter()

  useEffect(() => {
    
    console.log(router.query)
    console.log(props.list.surah.result,'ini result');
   
  }, [router])


return(
<Fragment>
    <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8"/>

      </Head>
    <div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Custom jumbotron</h1>
        <p class="col-md-8 fs-4">Using a series of utilities, you can create this jumbotron, just like the one in previous versions of Bootstrap. Check out the examples below for how you can remix and restyle it to your liking.</p>
        <button class="btn btn-primary btn-lg" type="button">Example button</button>
      </div>
    </div>
</Fragment>
)
}

export async function getStaticProps(context) {
    const { params } = context;
    const pid=params.id
    const surah= await GetSurah(pid);
    return {
      props: {
        list: {surah},
      },
    };
  }

  export function getStaticPaths() {
  const newArr=[]
   for (let index = 1; index <= 114; index++) {
     newArr.push({params:{id:index.toString()}})
     
   }
    return {
      paths: newArr,
      fallback: false,
    };
  }
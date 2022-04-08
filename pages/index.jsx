import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { GetTodaySchedule } from '../helper/request'
import { Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKaaba, faQuran } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'

export default function Home(props) {

  const router = useRouter()

  const [DefaultJadwal, setDefaultJadwal] = useState([])
  const [DefLocation, setDefLocation] = useState()
  const [active, setActive] = useState()


  const parseToObject=(tanggal,waktu)=>{
    let tanggalArray=tanggal.split('-');
    let waktuArray=waktu.split(':');
    return {year:tanggalArray[0],month:tanggalArray[1],day:tanggalArray[2],hour:waktuArray[0],minute:waktuArray[1]}
}

  const findNowJadwal=(dateAndTime)=>{
    if(!isUndefined(dateAndTime.datetime[0])){
      const now=DateTime.local().setZone('UTC+7');
    const imsakObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Imsak);
    const subuhObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Fajr);
    const dzuhurObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Dhuhr);
    const asharObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Asr);
    const maghribObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Maghrib);
    const isyaObject=parseToObject(dateAndTime?.datetime[0]?.date.gregorian,dateAndTime.datetime[0].times.Isha);

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

    return {
      name:"Not Found",
      time:""
    }
    
}

  useEffect(() => {
    setDefaultJadwal(props.list.getTodaySchedule.datetime)
    setDefLocation(props.list.getTodaySchedule.location)
    console.log(props.list.getTodaySchedule)
    const active=findNowJadwal(props.list.getTodaySchedule)
    setActive(active)
  }, [])

  return (
    <Fragment>
      <Head>
        <title>Quran App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8" />
      </Head>
      <div className={styles.box}></div>
      <div className={styles.container}>

        <main className={styles.main}>
          <div className=" container fixed-top " style={{ backgroundColor: "#34656d" }}>
            <h1 className="fs-2 fw-2 my-2 font-custom mb-3 " style={{ color: "white" }}>Muslim App</h1>
            <div className="row">
              <div className="col-sm-6">
                <div className="card mb-2" >
                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center" style={{minHeight:'120px'}}>
                      <div>
                        {/* <p className='text-lg-start fw-medium p-2 bg-success text-white rounded fs-6 mb-0'>Jadwal Sholat</p> */}
                        <p className='text-lg-start fw-medium py-1 px-2 bg-warning text-white rounded fs-6 mb-0'>{DefLocation?.city}</p>
                        <p className='text-lg-start fs-2 mb-0'>{active?.name}</p>
                        <p className='text-lg-start fs-6 mb-0'> {active?.time}</p>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faKaaba} size='s' height={100} width={100} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-2">
                <div className="card"  onClick={() => router.push('/quran')} style={{cursor:'pointer'}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center" style={{minHeight:'120px'}}>
                      <div>
                        <p className='text-lg-start fs-2 mb-1'>Baca Qur'an</p>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faQuran}  height={100} width={100} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container" style={{ marginTop: 111 }}>
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

  const getTodaySchedule = await GetTodaySchedule();
  return {
    props: {
      list: { getTodaySchedule },
    },
  };
}

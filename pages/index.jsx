import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { GetTodaySchedule } from '../helper/request'
import { Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKaaba, faQuran } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash";
import { useRouter } from 'next/router'

export default function Home(props) {

  const router = useRouter()

  const [DefaultJadwal, setDefaultJadwal] = useState([])
  const [DefLocation, setDefLocation] = useState()
  const [active, setActive] = useState()

  useEffect(() => {
    setDefaultJadwal(props.list.getTodaySchedule.datetime)
    setDefLocation(props.list.getTodaySchedule.location)
    setActive(props.list.getTodaySchedule.active)
    console.log(props.list.getTodaySchedule)
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

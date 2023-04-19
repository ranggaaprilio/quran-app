import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { GetSurah } from "../helper/request";
import { Fragment, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { isUndefined } from "lodash";
import _ from "lodash";
import moment from "moment-hijri";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function quran(props) {
  const [surah, setSurah] = useState([]);
  const [DefaultJadwal, setDefaultJadwal] = useState([]);
  const [DefLocation, setDefLocation] = useState();
  const [active, setActive] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dateNow, setDateNow] = useState(moment().format("iYYYY/iM/iD"));
  const [bookmark, setBookmark] = useState(0);
  const [allJadwal, setAllJadwal] = useState([]);

  useEffect(() => {
    async function getdata() {
      try {
        setIsLoading(true);
        const ipTrack = await fetch("https://json.geoiplookup.io/");
        const jsonData = await ipTrack.json();
        const getIdLocation = await fetch(
          `https://api.myquran.com/v1/sholat/kota/cari/${jsonData.city}`
        );
        const responsLocation = await getIdLocation.json();
        console.log(responsLocation, "responsLocation");
        let url = `https://api.myquran.com/v1/sholat/jadwal/1301/${DateTime.local().toFormat(
          "yyyy"
        )}/${DateTime.local().toFormat("MM")}/${DateTime.local()
          .setZone("UTC+7")
          .toFormat("dd")}`;
        if (responsLocation.status === true) {
          url = `https://api.myquran.com/v1/sholat/jadwal/${
            responsLocation.data[0].id
          }/${DateTime.local().toFormat("yyyy")}/${DateTime.local().toFormat(
            "MM"
          )}/${DateTime.local().setZone("UTC+7").toFormat("dd")}`;
        }
        console.log(url, "responsLocation2");
        const data = await fetch(url);
        const responseJson = await data.json();
        console.log(responseJson, "responsLocation3");
        if (responseJson.status === true) {
          console.log(responseJson, "code");
          setDefaultJadwal(responseJson.data.jadwal);
          setDefLocation(responseJson.data.daerah);
          const active = findNowJadwal(responseJson);
          const allData = findAllJadwal(responseJson);
          setAllJadwal(allData);
          setActive(active);
          setIsLoading(false);
        } else {
          throw new Error(responseJson.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    getdata();
  }, []);

  const findNowJadwal = (dateAndTime) => {
    if (!isUndefined(dateAndTime?.status)) {
      const now = DateTime.local().setZone("UTC+7");
      const imsakObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.imsak
      );
      const subuhObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.subuh
      );
      const dzuhurObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.dzuhur
      );
      const asharObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.ashar
      );
      const maghribObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.maghrib
      );
      const isyaObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.isya
      );

      const imsak = DateTime.fromObject(imsakObject);
      const subuh = DateTime.fromObject(subuhObject);
      const dzuhur = DateTime.fromObject(dzuhurObject);
      const ashar = DateTime.fromObject(asharObject);
      const maghrib = DateTime.fromObject(maghribObject);
      const isya = DateTime.fromObject(isyaObject);
      if (now < imsak) {
        return {
          name: "Imsak",
          time: imsak.toFormat("HH:mm"),
        };
      } else if (now < subuh) {
        return {
          name: "Subuh",
          time: subuh.toFormat("HH:mm"),
        };
      } else if (now < dzuhur) {
        return {
          name: "Dzuhur",
          time: dzuhur.toFormat("HH:mm"),
        };
      } else if (now < ashar) {
        return {
          name: "Ashar",
          time: ashar.toFormat("HH:mm"),
        };
      } else if (now < maghrib) {
        return {
          name: "Maghrib",
          time: maghrib.toFormat("HH:mm"),
        };
      } else if (now < isya) {
        return {
          name: "Isya",
          time: isya.toFormat("HH:mm"),
        };
      } else {
        console.log(isya, "isya");
        return {
          name: "Isya",
          time: isya.toFormat("HH:mm"),
        };
      }
    }

    return {
      name: "Not Found",
      time: "",
    };
  };

  const findAllJadwal = (dateAndTime) => {
    if (!isUndefined(dateAndTime?.status)) {
      const now = DateTime.local().setZone("UTC+7");
      const imsakObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.imsak
      );
      const subuhObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.subuh
      );
      const dzuhurObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.dzuhur
      );
      const asharObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.ashar
      );
      const maghribObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.maghrib
      );
      const isyaObject = parseToObject(
        dateAndTime?.data.jadwal.tanggal,
        dateAndTime?.data.jadwal.isya
      );

      const imsak = DateTime.fromObject(imsakObject);
      const subuh = DateTime.fromObject(subuhObject);
      const dzuhur = DateTime.fromObject(dzuhurObject);
      const ashar = DateTime.fromObject(asharObject);
      const maghrib = DateTime.fromObject(maghribObject);
      const isya = DateTime.fromObject(isyaObject);

      return [
        {
          name: "Imsak",
          time: imsak.toFormat("HH:mm"),
        },
        {
          name: "Subuh",
          time: subuh.toFormat("HH:mm"),
        },
        {
          name: "Dzuhur",
          time: dzuhur.toFormat("HH:mm"),
        },
        {
          name: "Ashar",
          time: ashar.toFormat("HH:mm"),
        },
        {
          name: "Maghrib",
          time: maghrib.toFormat("HH:mm"),
        },
        {
          name: "Isya",
          time: isya.toFormat("HH:mm"),
        },
      ];
    }
  };

  const parseToObject = (tanggal, waktu) => {
    const spiltArray = tanggal.split(" ");
    let tanggalArray = spiltArray[1].split("/");
    let waktuArray = waktu.split(":");
    return {
      year: tanggalArray[2],
      month: tanggalArray[1],
      day: tanggalArray[0],
      hour: waktuArray[0],
      minute: waktuArray[1],
    };
  };

  const search = (data = "") => {
    console.log(data, "data");
    const res = props.list.allSurah.result.data;
    if (data == "") {
      setSurah(res);
      return false;
    }
    let find = _.filter(res, function (item) {
      return item.name_latin.toLowerCase().indexOf(data.toLowerCase()) >= 0;
    });
    console.log(find);
    setSurah(find);
  };

  return (
    <Fragment>
      <Head>
        <title>Muslim App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8" />
      </Head>
      <main>
        <div className={styles.box}></div>
        <div className={styles.container}>
          <div className={styles.main}>
            <div
              className=" container fixed-top "
              style={{ backgroundColor: "#34656d", height: "40vh" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h1
                  className="fs-2 fw-2 my-2 font-custom mb-3 "
                  style={{ color: "white" }}
                >
                  Muslim App
                </h1>
              </div>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "75%" }}
              >
                {isLoading ? (
                  <div
                    className="d-flex justify-content-center flex-column"
                    width="100%"
                  >
                    <Skeleton width="600px" height="30px" />
                  </div>
                ) : (
                  <div>
                    <p
                      className="text-lg-start  mx-auto fs-4 fw-2 my-2 font-custom mb-3"
                      style={{
                        color: "white",
                        textAlign: "center",
                        paddingLeft: "100px",
                        paddingRight: "100px",
                      }}
                    >{`${DefLocation}, ${DateTime.local()
                      .setZone("UTC+7")
                      .toFormat("dd MMM")} : ${active?.name} ${
                      active?.time
                    }`}</p>
                    <div
                      className="d-flex justify-content-center text-white"
                      style={{ flexWrap: "wrap" }}
                    >
                      {allJadwal.map((item, index) => (
                        <div>
                          {" "}
                          {item.name}:{item.time} |{" "}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.menuGroup}>
          <div className={`${styles["main-card"]} card`}>
            <div className="card-body">
              <h5 className="card-title">Al Qur'an</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                30 Juz, 114 surah
              </h6>

              <Link href={`/quran`} className={styles.whenhover}>
                <span
                  style={{
                    marginBottom: 0,
                    cursor: "pointer",
                  }}
                >
                  Baca
                </span>
              </Link>
            </div>
          </div>
          <div className={`${styles["main-card"]} card `}>
            <div className="card-body">
              <h5 className="card-title">Al Hadist</h5>
              <h6 className="card-subtitle mb-2 text-muted">9 Books</h6>
              <Link href={`/hadist`} className={styles.whenhover}>
                <span
                  style={{
                    marginBottom: 0,
                    cursor: "pointer",
                  }}
                >
                  Baca
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://portofolio.devapril.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className="fw-bold">&nbsp; Rangga Aprilio Utama</span>
        </a>
      </footer>
    </Fragment>
  );
}

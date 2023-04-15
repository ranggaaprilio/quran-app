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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";

export default function quran(props) {
  const [surah, setSurah] = useState([]);
  const [DefaultJadwal, setDefaultJadwal] = useState([]);
  const [DefLocation, setDefLocation] = useState();
  const [active, setActive] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hadits, setHadits] = useState([]);
  const [bookmark, setBookmark] = useState(0);

  useEffect(() => {
    async function getdata() {
      try {
        setIsLoading(true);
        const ipTrack = await fetch("https://json.geoiplookup.io/");
        const listOfHadist = await GetHadist();
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
        const data = await fetch(url);
        const responseJson = await data.json();
        if (responseJson.status === true) {
          console.log(responseJson, "code");
          setDefaultJadwal(responseJson.data.jadwal);
          setDefLocation(responseJson.data.daerah);
          const active = findNowJadwal(responseJson);
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

  const GetHadist = async () => {
    try {
      const data = await fetch("https://api.hadith.gading.dev/books");
      const responseJson = await data.json();
      if (responseJson.code === 200) {
        console.log(responseJson, "code");
        setHadits(responseJson.data);
        console.log(hadits, "hadits");
      } else {
        throw new Error(responseJson.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

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
          <div
            className=" container fixed-top "
            style={{ backgroundColor: "#34656d" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h1
                className="fs-2 fw-2 my-2 font-custom mb-3 "
                style={{ color: "white" }}
              >
                Al Hadits
              </h1>
              {isLoading ? (
                <Skeleton width="300px" />
              ) : (
                <p
                  className="mb-0"
                  style={{ color: "white" }}
                >{`${DefLocation},${DateTime.local()
                  .setZone("UTC+7")
                  .toFormat("dd MMM")} : ${active?.name} ${active?.time}`}</p>
              )}
            </div>
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Cari nama hadits"
              aria-label="default input example"
              onChange={(e) => search(e.target.value)}
            ></input>
          </div>
          <div className="container" style={{ marginTop: 130 }}>
            <div className="row">
              {hadits.map((v, i) => (
                <Fragment key={i}>
                  <div
                    className={
                      hadits.length > 2 ? "col-sm-4 mb-2" : "col-sm-6 mb-2"
                    }
                  >
                    <div
                      className="card"
                      style={{ backgroundColor: "#fffbdf", minWidth: "300px" }}
                    >
                      <div className="card-body">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p
                            className="card-title"
                            style={{ fontFamily: "fontArab" }}
                          >
                            {i + 1 + ". "}
                          </p>
                          <h4
                            dir="rtl"
                            lang="ar"
                            className="card-title"
                            style={{ fontFamily: "fontArab" }}
                          >
                            <Link href={`#`} className={styles.whenhover}>
                              {v.name}{" "}
                              {bookmark == v.number && (
                                <FontAwesomeIcon
                                  icon={faBookBookmark}
                                  size="xs"
                                  height={10}
                                  width={10}
                                />
                              )}
                            </Link>
                          </h4>
                        </div>
                        <p className="card-text text-end">
                          Jumlah Hadist:&nbsp;{v.available}
                        </p>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
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
      </div>
    </Fragment>
  );
}

export async function getStaticProps() {
  const allSurah = await GetSurah();
  return {
    props: {
      list: { allSurah },
    },
  };
}

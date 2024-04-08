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
        const listOfHadist = await GetHadist();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    getdata();
  }, []);

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
              <h4>
                <Link href="/">
                  <span className={styles.whenhover} style={{ color: "white" }}>
                    kembali
                  </span>
                </Link>
              </h4>
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
              {isLoading ? (
                <div className="col-sm-12">
                  <Skeleton count={5} direction="ltr" enableAnimation="true" />
                </div>
              ) : (
                hadits.map((v, i) => (
                  <Fragment key={i}>
                    <div
                      className={
                        hadits.length > 2 ? "col-sm-4 mb-2" : "col-sm-6 mb-2"
                      }
                    >
                      <div
                        className="card"
                        style={{
                          backgroundColor: "#fffbdf",
                          minWidth: "300px",
                        }}
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
                              <Link
                                href={`/hadits/${v.id}`}
                                className={styles.whenhover}
                              >
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
                ))
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

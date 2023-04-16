import { Fragment, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetHadits } from "../../helper/request";
import ContentLoader from "react-content-loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styles from "../../styles/Home.module.css";

const MyLoader = (props) => (
  <ContentLoader
    speed={4}
    width={340}
    height={100}
    viewBox="0 0 340 84"
    backgroundColor="#212529"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100" height="15" />
    {/* <rect x="0" y="30" rx="3" ry="3" width="140" height="15" />  */}
    <rect x="127" y="48" rx="3" ry="3" width="53" height="15" />
    <rect x="187" y="48" rx="3" ry="3" width="72" height="15" />
    <rect x="18" y="48" rx="3" ry="3" width="100" height="15" />
    <rect x="0" y="71" rx="3" ry="3" width="37" height="15" />
    <rect x="18" y="23" rx="3" ry="3" width="140" height="15" />
    <rect x="166" y="23" rx="3" ry="3" width="173" height="15" />
  </ContentLoader>
);

export default function surah(props) {
  const router = useRouter();
  const ActiveBookmark = useRef();

  const [info, setInfo] = useState({});
  const [isi, setIsi] = useState([]);
  const [arti, setArti] = useState([]);
  const [number, setNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchHadits = async () => {
      const data = await GetHadits(router.query.id, "1-10");
      console.log(data);
      setIsi(data?.data?.hadiths);
      setInfo(data?.data);
      setLoading(false);
    };
    if (router.query.id) fetchHadits();

    // console.log(surah,'ini surah');
  }, [router]);

  const ConvertToArabicNumbers = (num) => {
    const arabicNumbers =
      "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
    return new String(num).replace(/[0123456789]/g, (d) => {
      return arabicNumbers[d];
    });
  };

  const setLastAyat = (surah, ayat) => {
    //set to localstorage
    const lastSurah = [surah, ayat];
    const getLastSurah = localStorage.getItem("lastSurah");
    if (getLastSurah) {
      const lastSurahArray = getLastSurah.split(",");
      if (
        lastSurahArray[0] == lastSurah[0] &&
        lastSurahArray[1] == lastSurah[1]
      ) {
        localStorage.setItem("lastSurah", []);
        setBookmark([]);
        alert(
          `QS. ${Ayat?.name_latin} Ayat ${ayat} telah di hapus dari daftar bacaan terakhir`
        );
      } else {
        localStorage.setItem("lastSurah", lastSurah);
        setBookmark(lastSurah);
        alert(`QS. ${Ayat?.name_latin} Ayat ${ayat} telah ditandai`);
      }
    } else {
      localStorage.setItem("lastSurah", lastSurah);
      setBookmark(lastSurah);
      alert(`QS. ${Ayat?.name_latin} Ayat ${ayat} telah ditandai`);
    }
  };

  const isSameBookmark = (surah, ayat) => {
    const lastSurah = [surah, ayat];
    const getLastSurah = localStorage.getItem("lastSurah");
    console.log(getLastSurah);

    if (getLastSurah) {
      const lastSurahArray = getLastSurah.split(",");
      if (
        lastSurahArray[0] == lastSurah[0] &&
        lastSurahArray[1] == lastSurah[1]
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{info?.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="text/html;charset=UTF-8" />
      </Head>
      <div className="p-4 mb-4 " style={{ backgroundColor: "#c6ffc1" }}>
        <div className="container-fluid py-2">
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              size="xs"
              height={14}
              width={14}
            />
            <Link href={`/hadist`} className={styles.whenhover}>
              <span
                style={{ padding: "16px", marginBottom: 0, cursor: "pointer" }}
              >
                kembali
              </span>
            </Link>
          </div>
          <div>
            {loading ? (
              <MyLoader />
            ) : (
              <>
                <div>
                  <h1 className="display-5 fw-medium text-green-900 arab ">
                    {info?.name}
                  </h1>
                  <h5 className="fs-3 fw-medium text-green-900 ">
                    Jumlah Riwayat: {info?.available}
                  </h5>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isi.map((v, i) => (
        <div
          className="p-3"
          ref={isSameBookmark(+router.query.id, i + 1) ? ActiveBookmark : null}
        >
          <p dir="rtl" lang="ar" className=" fs-1 ms-2 pb-1 pr-5 arab">
            {v.arab} &nbsp;
          </p>

          <p className=" fs-5 ms-1 p-1">
            {i + 1}.{v.id}
          </p>
          <hr className=" mb-2" style={{ borderTop: "1px dashed #34656d" }} />
        </div>
      ))}
      <div></div>
      {/* <div ref={ActiveBookmark}>TEst</div> */}
    </Fragment>
  );
}

import { Fragment, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Getayat } from "../../helper/request";
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

  const [Ayat, setAyat] = useState({});
  const [isi, setIsi] = useState([]);
  const [arti, setArti] = useState([]);
  const [number, setNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState([]);
  const [juz, setJuz] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchAyat = async () => {
      const surah = await Getayat(router.query.id);
      if (surah != false) {
        let result = surah?.result?.data;
        // console.log();

        setAyat(result);
        setIsi(Object.values(result?.text));
        setArti(Object.values(result?.translations?.id.text));
        setNumber(Object.keys(result?.text));
        setLoading(false);
        setBookmark(localStorage.getItem("MultilastSurah") || []);
        setJuz(result?.lastJuz || []);

        //check if bookmark
        const getLastSurah = localStorage.getItem("MultilastSurah");

        if (getLastSurah) {
          //parse to array
          const parseArray = JSON.parse(getLastSurah);

          //waiting for scrolling
          setTimeout(() => {
            if (Array.isArray(parseArray)) {
              if (parseArray.find((v) => v[router.query.id])) {
                //make autoscroll to ref
                // console.log("masuk", ActiveBookmark.current);
                ActiveBookmark.current.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  // inline: "center",
                });
              }
            }
          }, 1000);
        }
      }
    };

    fetchAyat();
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

  const setMultiLastAyat = (surah, ayat) => {
    //set to localstorage
    const lastSurah = { [surah.toString()]: ayat };
    const getLastSurah = localStorage.getItem("MultilastSurah");

    if (getLastSurah) {
      //change to array
      const parseArray = JSON.parse(getLastSurah);
      const findSameSurah = parseArray.find((v) => v[surah] === ayat);
      if (findSameSurah) {
        //if same surah
        const filterSameSurah = parseArray.filter((v) => !v[surah]);
        localStorage.setItem("MultilastSurah", JSON.stringify(filterSameSurah));
        setBookmark([]);
        alert(
          `QS. ${Ayat?.name_latin} Ayat ${ayat} telah di hapus dari daftar bacaan terakhir`
        );
      } else {
        //if not same surah replace last surah with new surah
        const filterSameSurah = parseArray.filter((v) => !v[surah]);
        const newLastSurah = [...filterSameSurah, lastSurah];
        localStorage.setItem("MultilastSurah", JSON.stringify(newLastSurah));
        setBookmark(newLastSurah);
        alert(`QS. ${Ayat?.name_latin} Ayat ${ayat} telah ditandai`);
      }
    } else {
      const lastSurahArray = [];
      lastSurahArray.push(lastSurah);
      localStorage.setItem("MultilastSurah", JSON.stringify(lastSurahArray));
      setBookmark(lastSurah);
      alert(`QS. ${Ayat?.name_latin} Ayat ${ayat} telah ditandai`);
    }
  };

  const isSameBookmark = (surah, ayat) => {
    const lastSurah = [surah, ayat];
    const getLastSurah = localStorage.getItem("MultilastSurah");

    if (getLastSurah) {
      //parse to array
      const parseArray = JSON.parse(getLastSurah);
      const findSameSurah = parseArray.find((v) => v[surah] === ayat);

      if (findSameSurah) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{Ayat?.name_latin}</title>
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
            <Link href={`/quran`} className={styles.whenhover}>
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
                    {Ayat?.name_latin}({Ayat?.name})
                  </h1>
                  <h5 className="fs-3 fw-medium text-green-900 ">
                    Makna: {Ayat?.translations?.id.name}
                  </h5>
                </div>
                <div>
                  <h6 className="fs-5 fw-light text-green-900 ">
                    Surah ke- {Ayat?.number}
                  </h6>
                  <div className="d-flex justify-content-between">
                    <h6 className="fs-5 fw-light text-green-900 ">
                      Jumlah Ayat ({Ayat?.number_of_ayah} )
                    </h6>
                    {/* <button type="button" class="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tandai ayat terakhir"> <FontAwesomeIcon icon={faBookBookmark} size="xs" height={14} width={14} /></button> */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {isi.map((v, i) => (
          <div
            className="p-3"
            ref={
              isSameBookmark(+router.query.id, i + 1) ? ActiveBookmark : null
            }
          >
            <p dir="rtl" lang="ar" className=" fs-1 ms-2 pb-1 pr-5 arab">
              {/* render ayat */}
              {v} &nbsp;
              <span className="numcontainer">
                {/* <img style={{display:"inline-block",height:"60px",width:"60px"}} src="/arabic-design-circular-border-ornamental-round-vector-13473464-removebg-preview.png" alt="border" srcset="" /> */}
                <div className="circle">
                  <p className="centered" style={{ color: "#212529" }}>
                    {ConvertToArabicNumbers(number[i])}
                  </p>
                </div>
              </span>
            </p>

            <p className=" fs-5 ms-1 p-1">
              {i + 1}.{arti[i]}
            </p>
            <div className="d-flex justify-content-between p-2">
              {
                //check if last ayat
                juz.find((v) => +v.ayah === i + 1) ? (
                  <div className="alert alert-success" role="alert">
                    Akhir dari Juz {juz.find((v) => v.ayah === i + 1).juz}
                  </div>
                ) : (
                  <div></div>
                )
              }
              <button
                type="button"
                className={`btn  btn-sm ${
                  isSameBookmark(+router.query.id, i + 1)
                    ? "btn-success"
                    : "btn-danger"
                }`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Tandai ayat terakhir"
                onClick={() => setMultiLastAyat(+router.query.id, i + 1)}
                style={{ height: "fit-content" }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faBookBookmark}
                  size="xs"
                  height={10}
                  width={10}
                />
              </button>
            </div>
            <hr className=" mb-2" style={{ borderTop: "1px dashed #34656d" }} />
          </div>
        ))}
      </div>
      {/* <div ref={ActiveBookmark}>TEst</div> */}
    </Fragment>
  );
}

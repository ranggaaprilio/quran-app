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
import InfiniteScroll from "react-infinite-scroll-component";

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

export default function hadist(props) {
  const router = useRouter();
  const ActiveBookmark = useRef();

  const [info, setInfo] = useState({});
  const [isi, setIsi] = useState([]);
  const [arti, setArti] = useState([]);
  const [number, setNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState([]);
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchHadits = async () => {
      const data = await GetHadits(router.query.id, 1);
      console.log(data, "datattt");
      setIsi(data?.data?.hadiths);
      setInfo(data?.data);
      setAvailable(data?.data?.available);
      setLoading(false);
    };
    if (router.query.id) fetchHadits();

    // console.log(surah,'ini surah');
  }, [router]);

  const LoadHadits = async () => {
    const data = await GetHadits(router.query.id, isi.length);
    console.log(data);
    setIsi([...isi, ...data?.data?.hadiths]);
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
      <InfiniteScroll
        dataLength={isi.length} //This is important field to render the next data
        next={LoadHadits}
        hasMore={isi.length < available}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        {isi.map((v, i) => (
          <div className="p-3">
            <p dir="rtl" lang="ar" className=" fs-1 ms-2 pb-1 pr-5 arab">
              {v.arab} &nbsp;
            </p>

            <p className=" fs-5 ms-1 p-1">
              {i + 1}.{v.id}
            </p>
            <hr className=" mb-2" style={{ borderTop: "1px dashed #34656d" }} />
          </div>
        ))}
      </InfiniteScroll>

      <div></div>
      {/* <div ref={ActiveBookmark}>TEst</div> */}
    </Fragment>
  );
}

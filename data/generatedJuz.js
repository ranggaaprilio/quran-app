// Fungsi untuk mengambil data Alquran
async function getQuranData(juz) {
  const response = await fetch(`http://api.alquran.cloud/v1/juz/${juz}`);
  const data = await response.json();
  return data.data;
}

// Fungsi untuk menghasilkan array informasi juz
async function generateJuzInfo() {
  const juzInfo = [];

  for (let juz = 1; juz <= 30; juz++) {
    const data = await getQuranData(juz);
    const ayahs = data.ayahs[data.ayahs.length - 1];
    const surah = ayahs.surah.number;
    const ayah = ayahs.numberInSurah;

    const juzData = {
      juz: juz,
      surah: surah,
      ayah: ayah,
    };

    juzInfo.push(juzData);
  }

  return juzInfo;
}

// Memanggil fungsi untuk menghasilkan array informasi juz
generateJuzInfo().then((juzInfoArray) => {
  console.log(juzInfoArray);
});

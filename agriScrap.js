import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

if (process.argv.length < 4) {
  console.log("\x1b[33mVeuillez spécifier les deux paramètres requis :\x1b[0m'")
  console.log("1.\x1b[33mL'URL\x1b[0m de base.")
  console.log("2.\x1b[33mLe nom du fichier Excel\x1b[0m dans lequel les données seront sauvegardées.")
  console.log("Exemple: node agriscrap.js https://agriestdistribution.fr/Bennes-a-grappins--0000792-vente/BENNE-A-GRAPPIN-AP-BG-AVC-DTS-LG-1500-QUICKE-3--0002510.html excel_agriest")
  process.exit(1);
}

const baseUrl = process.argv[2];
const fileName = process.argv[3];

console.log('Bienvenue chez\x1b[33m AgriScrap\x1b[0m !')
console.log(`\x1b[33mRécupération des données en cours\x1b[0m, l'url de base est : ${baseUrl} .`);
console.log(`Les données seront sauvegardées dans un fichier\x1b[33m ${fileName}.xlsx\x1b[0m dans le dossier 'results'`);

const getProducts = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  let hasNextPage = true;
  let hasProperties;

  await page.goto(`${baseUrl}`, {
    waitUntil: "domcontentloaded",
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${fileName}`);


  while (hasNextPage) {
      const products = await page.evaluate(() => {

          const productTable = document.querySelector(".table-ui-shop-property-table");

          if(productTable !== null){
            const productRows = productTable.querySelectorAll("tr")

            return Array.from(productRows).map((product) => {
              const key = product.querySelector(".ui-shop-prop-label").innerText;
              const value = product.querySelector(".ui-shop-prop-valeur").innerText;

              return [key,value]
            })
          }else{
            return []
          }

      });
      const productName = await page.evaluate(() => document.querySelector('.ui-shop-nom').innerText)
      const productRef = await page.evaluate(() => document.querySelector('.ui-shop-ref > .ui-shop-ref-value').innerText)

      console.log(productName,productRef)

      worksheet.addRow(["Nom",productName])
      worksheet.addRow(["Ref",productRef])
      products.forEach((product) => {
        worksheet.addRows([product]);
          console.log(product)
      });
      worksheet.addRow([""])
      worksheet.addRow(["-------","-------"])
      worksheet.addRow([""])

      hasNextPage = await page.evaluate(() => {
          const nextButton = document.querySelector(".pull-right > a");
          return nextButton !== null;
      });
      
      if (hasNextPage) {
        let href = await page.evaluate(() => {
            return document.querySelector(".pull-right > a").href
        });
        await page.goto(href, {
            waitUntil: "domcontentloaded",
        });      
      }
  }

  await workbook.xlsx.writeFile(`results/${fileName}.xlsx`);          

await browser.close();

}

getProducts();

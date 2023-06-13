import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

const getProducts = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  let hasNextPage = true;
  let hasProperties;
  // let clapet = "Non";


  await page.goto("https://agriestdistribution.fr/Bennes-a-grappins--0000792-vente/BENNE-A-GRAPPIN-AP-BG-AVC-DTS-LG-1500-QUICKE-3--0002510.html", {
    waitUntil: "domcontentloaded",
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Bennes");
  worksheet.addRow(["Nom","Ref","Type","Largeur","Modèle","Type d'attelage","Volume théorique", "Poids","Clapet"])


  while (hasNextPage) {
    // for(let i = 0; i<3;i++){
      const products = await page.evaluate(() => {

          const productTable = document.querySelector(".table-ui-shop-property-table");

          if(productTable !== null){
            const productRows = productTable.querySelectorAll("tr")


            return Array.from(productRows).map((product) => {
              const key = product.querySelector(".ui-shop-prop-label").innerText;
              const value = product.querySelector(".ui-shop-prop-valeur").innerText;

              return value
            })
          }

      });
      const productName = await page.evaluate(() => document.querySelector('.ui-shop-nom').innerText)
      const productRef = await page.evaluate(() => document.querySelector('.ui-shop-ref > .ui-shop-ref-value').innerText)



      products.unshift(productRef)
      products.unshift(productName)

      worksheet.addRow(products)
      console.log(products)

      worksheet.addRow(["-------","-------"])

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

  await workbook.xlsx.writeFile("test.xlsx");          

await browser.close();

}

getProducts();

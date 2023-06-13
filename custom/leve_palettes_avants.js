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

  await page.goto("https://agriestdistribution.fr/Leve-palettes-avants--0000774-vente/LEVE-PALETTE-1-2T-FOURCHE-1200-TYPE-AUSA--0065958.html", {
    waitUntil: "domcontentloaded",
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("leve_palettes_avants");


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
          // worksheet.addRow([product.key, product.value]);
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

  await workbook.xlsx.writeFile("results/leve_palettes_avants.xlsx");          

await browser.close();

}

getProducts();

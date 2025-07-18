# AgriScrap

**AgriScrap** is a Node.js web scraper using Puppeteer that logs into [agriestdistribution.fr](https://agriestdistribution.fr), scrapes product data from a starting URL (including name, reference, price, and technical specifications), and exports it to an Excel file.

## Features

- Logs into your Agriest account with provided credentials
- Extracts product name, reference, price, and technical properties
- Automatically follows pagination to scrape all linked products
- Exports all data into an `.xlsx` file using `ExcelJS`

## Requirements

- [Node.js](https://nodejs.org/)
- An Agriest account with valid credentials

Install dependencies:

```bash
npm install puppeteer exceljs
````

## Usage

Run the script with the following parameters:

```bash
node agriscrap.js <email> <password> <base_url> <excel_filename>
```

### Example:

```bash
node agriscrap.js mon.email@mail.com mdp1234 https://agriestdistribution.fr/Bennes-a-grappins--0000792-vente/BENNE-A-GRAPPIN-AP-BG-AVC-DTS-LG-1500-QUICKE-3--0002510.html produits_grappins
```

This will:

* Log into your account
* Start scraping the product page and any paginated related products
* Save the results in `results/produits_grappins.xlsx`

## Output

The Excel file contains:

* Product name
* Reference
* Price (brut)
* A list of key-value technical properties

## Notes

* The script uses **brut pricing** by default.
* Ensure the target URL is a **product detail page** that may contain multiple variants.
* Output files are saved in the `results/` folder (create it if it doesn’t exist).


## Disclaimer

This project is for educational purpose only. It taught and demonstrates how to automate login and data extraction using Puppeteer
Always consult and comply with the Terms of Service of any website before performing automated actions.

const puppeteer = require('puppeteer');

const headless = async (url, {timeout=8, debug=false}) => {
  let download_link = '';

  let opt = debug ? {headless: false, slowMo: 250 } : {}

  const browser = await puppeteer.launch(opt);
  const page = await browser.newPage();
  console.log(`Open ${url}`)
  await page.goto(url);

  let saveLink = await page.evaluate(() => document.querySelector('.download-link a').href)
  
  await page.goto(saveLink);

  return new Promise( (resolve) => {
    setTimeout(async () => {
      console.log(`Waiting for download link...`)
      download_link = await page.evaluate(() => document.querySelector('.result a').href)
      await browser.close();
      return resolve(download_link)
    },  (timeout * 1000));
  });

}



module.exports = headless


const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')
async function  medFinder(MedName) {

// Launch the browser and open a new blank page
   // const browser = await puppeteer.launch({headless: 'new'})
   const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
    const page = await browser.newPage();
// Navigate the page to a URL
    await page.goto(process.env.URLSCRAPPED)
// Set screen size
    await page.setViewport({width: 1080, height: 1024})

// Type into search box
await page.type('.search-input', MedName);
await page.click('.material-icons-outlined')

// Wait Page to load
await page.waitForNavigation({waitUntil: 'load',timeout:0})

// Select all cards and return 5 firsts results
const data = []
const searchResultSelector = 'div[class="card"]'
await page.waitForSelector(searchResultSelector)


for (let i = 0; i < 5; i ++) {
    const searchResults = await page.$$('div[class="card"]')
    if(searchResults[i]){
    await searchResults[i].click();
    await page.waitForSelector('.main-layout')
    const productData = await page.evaluate(() => {
        let title = document.querySelector('.title').innerHTML; 
        let image = document.querySelector('figure > img').src;
        let price = document.querySelector('.price').innerText;
        let posologie = document.querySelector('.description').innerText;
        let description = document.querySelector('#Présentation').innerText;
        let type = document.querySelectorAll('[itemprop="name"]')[1].innerText
        let need_prescription= false
        if(type ==='Médicaments') {
            need_prescription= Math.random() <0.25;
        }
        return {title, image, price, posologie, description, type,need_prescription}
 })
 data.push(productData);};
 
 await page.goBack();
 
}

 // Locate the full title and save it

 await browser.close()
 return data
}

module.exports = {medFinder}
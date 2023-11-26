(fs = require("fs")), (puppeteer = require("puppeteer"));
const agents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/79.0.3945.73 Mobile/15E148 Safari/604.1",
];

const express = require("express");
const app = express();
const port = 8000;
let browser;

app.use(express.json());

async function main() {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  //   browser.close();
}

async function screenshoot(browser, url, text, image_name = "screenshot") {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1280,
    deviceScaleFactor: 1,
  });
  await page.setUserAgent(agents[0]);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate((text) => {
    document.getElementById("inner_text").innerHTML = text;
  }, text);
  //   await page.$eval("#inner_text", text_changer.bind(text));
  //   await page.evaluate(
  //     () => (document.querySelector("#inner_text").innerHTML = text)
  //   );
  await page.screenshot({ path: image_name + ".jpeg", type: "jpeg" });
  page.close();
}

app.listen(port, () => {
  let url = "file://" + __dirname + "/invitation_page.html";
  app.post("/screenshoot", async (req, res) => {
    let text = req.body.text;
    let file = req.body.url ? req.query.url : url;
    await screenshoot(browser, file, text, req.query.name);
    res.send("printed");
  });
  main();
});

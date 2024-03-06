import dotenv from "dotenv";
import axios from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import { globSync } from 'glob';

const themeCommentRegex = /\/\*[\s\S]*?\*\//g;

async function getTheme() {
  let themeUrl = process.env.THEME;
  console.log(`Current THEME is set to ${themeUrl}`)
  if (themeUrl) {
    //https://forum.obsidian.md/t/1-0-theme-migration-guide/42537
    //Not all themes with no legacy mark have a theme.css file, so we need to check for it

    console.log("  theme: checking for theme.css..")
    try {
      await axios.get(themeUrl);
    } catch {
      if (themeUrl.indexOf("theme.css") > -1) {
        themeUrl = themeUrl.replace("theme.css", "obsidian.css");
      } else if (themeUrl.indexOf("obsidian.css") > -1) {
        themeUrl = themeUrl.replace("obsidian.css", "theme.css");
      }
    }
    console.log(`  theme: final URL is ${themeUrl}`)

    const res = await axios.get(themeUrl);
    console.log(`  theme: axios GET request made to ${themeUrl}`);
    console.log(`  theme: response status is ${res.status}`);
    console.log(`  theme: response status text is ${res.statusText}`);
    console.log(`  theme: response headers are ${JSON.stringify(res.headers)}`);
    console.log(`  theme: response data type is ${typeof res.data}`);
    try {
      const existing = globSync("src/site/styles/_theme.*.css");
      existing.forEach((file) => {
        fs.rmSync(file);
      });
    } catch (err) {
      console.error(`  theme: error while deleting existing theme files: ${err.message}`);
      console.log(`  theme: error details: ${JSON.stringify(err, null, 2)}`);
    }
    let skippedFirstComment = false;
    const data = res.data.replace(themeCommentRegex, (match) => {
      if (skippedFirstComment) {
        return "";
      } else {
        skippedFirstComment = true;
        return match;
      }
    });
    const hashSum = crypto.createHash("sha256");
    hashSum.update(data);
    const hex = hashSum.digest("hex");
    const filename = `src/site/styles/_theme.${hex.substring(0, 8)}.css`
    console.log(`  theme: writing theme file as ${filename}`)
    fs.writeFileSync(filename, data);
  }
}

getTheme();

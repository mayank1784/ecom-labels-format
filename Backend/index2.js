import { PdfReader } from "pdfreader";
import fs from "fs";
let text = "";
const pdfPath = "./public/input/amatest2.pdf";
const pdfData = fs.readFileSync(pdfPath);
const pdfDoc = new PdfReader().parseFileItems(pdfPath);
const item = pdfDoc.item.text;
console.log(item);

//@ts-nocheck
//I dont wanna deal with types :P
import * as ImageScript from "imagescript";
import { performance } from "perf_hooks";
const { Image } = ImageScript;
process.once("message", async (base64Img) => {
  let start = performance.now();
  let imgBuffer = Buffer.from(base64Img, "base64");
  const img = await Image.decode(imgBuffer).catch((err) => {
    console.log(err);
    return null;
  });
  console.log(`Decoded image in ${performance.now() - start}`);
  start = performance.now();
  if (!img) {
    console.log("Failed to decode image");
    process.send("");
    return;
  }
  //Cut out a center square
  let squareSideLength = Math.min(img.width, img.height);
  let x = (img.width - squareSideLength) / 2;
  let y = (img.height - squareSideLength) / 2;
  let square = img.crop(x, y, squareSideLength, squareSideLength);
  //Resize to 200x200
  let resized = square.resize(512, 512);
  console.log(`Resized image in ${performance.now() - start}`);
  start = performance.now();
  //Encode to png
  let png = await resized.encode(8);
  console.log(`Encoded image in ${performance.now() - start}`);
  start = performance.now();

  //Send to parent process
  process.send(Buffer.from(png).toString("base64"));
  console.log(`Sent image in ${performance.now() - start}`);
  // setTimeout(() => {
  //   process.exit(0);
  // }, 5000);
});

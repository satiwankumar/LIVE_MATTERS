var fs = require("fs");
var path= require('path')
exports.GET_IMAGE_PATH = async function (image) {
try {
  const match = ["image/png", "image/jpeg","image/jpg"];
  let r = Math.random().toString(36).substring(7)

  if (match.indexOf(image.type) === -1) {
    throw new Error('invalid image type')
  }


pathName = `uploads/images/${r+""+image.originalFilename.replace(/\s/g,  "" ) }`;
//   let pathName = `uploads/files/images/${image.originalFilename.replace(
//     /\s/g,
//     ""
//   )}`;
let stream = await fs.readFileSync(image.path);
 await fs.writeFileSync(path.join(__dirname, `../${pathName}`), stream);

console.log("ImageURl",pathName)
// clean it and return

return pathName;
} catch (error) {
  throw error
}
   
};

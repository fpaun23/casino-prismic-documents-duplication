const fs = require('fs-extra');
const zipper = require('zip-local');

const emptyFolder = async (folder) => {
  try {
    await fs.emptyDir(folder)    
  } catch (err) {
    console.error(err)
  }
}

const createFolder = async (folder) => {
    try {
        await fs.ensureDir(folder)
      } catch (err) {
        console.error(err)
      }
}

const changeFilename = (filename = "", grouplang = "", locale = "") => {
  
  let changedFilename = ""

  if (filename != "" && grouplang != "" && locale != "") {
    changedFilename = "translate_" + grouplang + "_" + locale + '.json';
  }

  return changedFilename;
}

const changeFilename2 = (v) => {
  
  return changedFilename = "t_" + v + '.json';
}

const makeArchive = async (folder = "", archiveName = "archive", iterations = 1) => {
      
  if (folder != "") {

    console.log('Starting archive process...');    
    let z = 0;
    for (let i=1; i<=iterations; i++) {
      zipper.zip(folder + "/" + i , function(error, zipped) {

          if(!error) {
              zipped.compress(); // compress before exporting
      
              var buff = zipped.memory(); // get the zipped file as a Buffer
      
              // or save the zipped file to disk
              zipped.save("exports_zip/" + archiveName + i + ".zip", function(error) {
                  if(!error) {
                      console.log("Created zip archive --> exports_zip/" + archiveName + i + ".zip");
                      z++;
                      //res.json("archive.zip");
                  }
              });
          }
      });
    }

    return z;
    
} else {
    console.log('Invalid /zip request!');
}
}

const removeFile = async (path) => {
  await fs.remove(path)  
}

module.exports = {
    emptyFolder,
    createFolder,
    makeArchive,
    changeFilename,
    removeFile,
    changeFilename2    
};
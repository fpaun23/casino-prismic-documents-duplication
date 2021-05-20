var fs = require('fs');
const utilsFolders = require('./folders');
const parser = require('./parse');

// make Promise version of fs.readdir()
fs.readdirAsync = function(dirname) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename, enc) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data){
            if (err) 
                reject(err); 
            else
                resolve(data);
        });
    });
};

fs.writeFileAsync = function(filename, data) {
    fs.writeFile('exports_bulk_cross_repo/locale/en-us/'+filename, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

  }
// utility function, return Promise
function getFile(filename) {
    return fs.readFileAsync("exports_bulk_cross_repo/bulk/" + filename, 'utf8');
}

// utility function, return Promise
function createFolder(folder) {    

    return fs.mkdir(folder , { recursive: true }, (err) => {});
}

const getMappingObj  = (uid, type, filename) => {
    
    return { 
        "id":filename.split("$")[0],
        "uid": uid,
        "type": type
        } 

}

const mapUid = (uidSource, uidTarget) => {
 
    let mappedUid = [];

    uidTarget.forEach(targetObj => {

        let sourceObj = uidSource.find(obj => (obj.uid == targetObj.uid && obj.type == targetObj.type))
        
        if (typeof sourceObj != 'undefined' && targetObj != 'undefined') {
            if (sourceObj.hasOwnProperty("id") && targetObj.hasOwnProperty("id")) {
                mappedUid.push(
                        {
                            target_id: targetObj.id,
                            source_id: sourceObj.id,
                            uid: targetObj.uid ,
                            type: targetObj.type
                        }
                    )
            }
        }     
    })

    return mappedUid;
}

const duplicateContent = async (sourceLocale = '', targetLocale = '') => {
 console.log("DUPLICATE....")
    if (sourceLocale == '' || targetLocale == '') {
        console.log("Invalid target or source locale!")
        return "Invalid locales";
    }
    console.log("Locale target:", targetLocale)
    console.log("Locale source:", sourceLocale)

    let arrUid_source = [];
    let arrTargetLocale = [];
    //let arrSourceLocale = [];
    let arrTargetLocaleFiles = []; 
      
    let arrFilenames = [];

    await utilsFolders.emptyFolder('exports_bulk_cross_repo/locale');
    await utilsFolders.emptyFolder('exports_zip');
    
    await utilsFolders.createFolder('exports_bulk_cross_repo/mapping');
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/target');    
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/source');
    //await utilsFolders.createFolder('exports_bulk_cross_repo/locale/mapping');
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/to_zip');

    await utilsFolders.removeFile('exports_bulk_cross_repo/mapping/uid_source.json')
    await utilsFolders.removeFile('exports_bulk_cross_repo/mapping/uid_target.json');
    await utilsFolders.removeFile('exports_bulk_cross_repo/mapping/mapped.json');
          
    fs.readdirAsync('./exports_bulk_cross_repo/bulk').then(function (filenames){   
        
        arrFilenames = filenames

        return Promise.all(filenames.map(getFile));

    }).then(function (files){        
        let i = -1;

        files.forEach(function(file) {
            i = i + 1;
                                
            var json_file = JSON.parse(file);            
            
            if (json_file.lang == sourceLocale) {
               
                delete json_file.grouplang;
                json_file.lang = targetLocale;
                
                arrTargetLocaleFiles.push(arrFilenames[i])             
                arrTargetLocale.push(json_file);
            }        
            //console.log(json_file)            
        });

        return arrTargetLocale;

    }).then(async function(r){
        let v = -1;
        let nbFiles = -1;
                
        for(let y=1; y<=Math.ceil(r.length / 200); y++) {
            await utilsFolders.createFolder('exports_bulk_cross_repo/locale/to_zip/' + y);    
        }
        
        arrTargetLocale.forEach(a => {

            v = v+1;
            arrUid_source.push(getMappingObj(a.uid, a.type, arrTargetLocaleFiles[v]));
            const fName = utilsFolders.changeFilename2(v);

            if (fName != "") {

                nbFiles++;                
                
                fs.writeFile('exports_bulk_cross_repo/locale/target/' + fName, JSON.stringify(a, null, 2), (err) => {
                    if (err) throw err;
                    
                });  

                //used for debugging and development
                fs.writeFile('exports_bulk_cross_repo/locale/source/' + arrTargetLocaleFiles[v], JSON.stringify(a, null, 2), (err) => {
                    if (!err) {}
                                        
                });  

                const subfolderTo_Zip = Math.trunc(v/200) +1;
                        
                fs.writeFile('exports_bulk_cross_repo/locale/to_zip/' + subfolderTo_Zip + "/" + fName, JSON.stringify(a, null, 2), (err) => {
                    if (err) throw err;
                    //console.log('The file has been saved!');
                });  
            }
        
            
        })
        return nbFiles;

    }).then(async function(v){

        console.log("Total json files to archive :" + v)

        fs.writeFile('exports_bulk_cross_repo/mapping/uid_source.json',  JSON.stringify(arrUid_source, null, 2), (err) => {
            if (err) throw err;
            //console.log('The file has been saved!');            
        });

        const totalSubfoldersTo_Zip = Math.ceil(v / 200);        

        const results = await utilsFolders.makeArchive('exports_bulk_cross_repo/locale/to_zip', "archive", totalSubfoldersTo_Zip);

        return results;        
    })
}

/*
**********************************************************************
******************************* UPDATE *******************************
**********************************************************************
*/

const updateContent = async (sourceLocale = '') => {

    console.log("UPDATING....")
    if (sourceLocale == '') {
        console.log("Invalid source locale!")
        return "Invalid locales";
    }
    console.log("Locale source: ", sourceLocale); 

    let arrUid_target = [];
    let arrTargetLocale = [];
    let arrTargetLocaleFiles = [];    
      
    let arrFilenames = [];

    await utilsFolders.emptyFolder('exports_bulk_cross_repo/locale');
    await utilsFolders.emptyFolder('exports_zip');
    
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/target');    
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/source');
    await utilsFolders.createFolder('exports_bulk_cross_repo/locale/to_zip');

    await utilsFolders.removeFile('exports_bulk_cross_repo/mapping/uid_target.json')    
    await utilsFolders.removeFile('exports_bulk_cross_repo/mapping/mapped.json')
    
    // read all json files in the directory, filter out those needed to process, and using Promise.all to time when all async readFiles has completed. 
    fs.readdirAsync('./exports_bulk_cross_repo/bulk').then(function (filenames) {   
        
        arrFilenames = filenames

        return Promise.all(filenames.map(getFile));
        
    }).then(function (files){        
        let i = -1;
        files.forEach(function(file) {
            i = i + 1;
                     
            var json_file = JSON.parse(file);            
            
            if (json_file.lang === sourceLocale) {             
                arrTargetLocaleFiles.push(arrFilenames[i])
                arrTargetLocale.push(json_file);
            }        
        });        

        return arrTargetLocale;

    }).then(async function(r){
        let v = -1;        

        for(let y=1; y<=Math.ceil(r.length / 200); y++) {
            await utilsFolders.createFolder('exports_bulk_cross_repo/locale/to_zip/' + y);    
        }
        
        arrTargetLocale.forEach(a => {

            v = v+1;            
            
            arrUid_target.push(getMappingObj(a.uid, a.type, arrTargetLocaleFiles[v]));    

            fs.writeFile('exports_bulk_cross_repo/locale/source/' + arrTargetLocaleFiles[v], JSON.stringify(a, null, 2), (err) => {
                if (!err) {}                              
            });                  
        })

        fs.writeFile('exports_bulk_cross_repo/mapping/uid_target.json',  JSON.stringify(arrUid_target, null, 2), (err) => {
            if (err) throw err;
            //console.log('The file has been saved!');            
        });

        return v;

    }).then(function(v) {
                            
        const uidSource = require('../exports_bulk_cross_repo/mapping/uid_source.json')        

        const mappedUidArr = mapUid(uidSource, arrUid_target);
       
        fs.writeFile('exports_bulk_cross_repo/mapping/mapped.json',  JSON.stringify(mappedUidArr, null, 2), (err) => {
            if (err) throw err;
            //console.log('The file has been saved!');            
        });

        let sourceFilenames = [];

        fs.readdirAsync('./exports_bulk_cross_repo/locale/source').then(function (filenames) {               

            sourceFilenames = filenames;            
            return Promise.all(filenames.map(getFile));

        }).then(function(files) {            
            let i = -1;
            files.forEach(function(file) {

            i = i + 1;                         
            
            let json_file = JSON.parse(file);
                            
            const updatedFile = parser.updateFileContent(json_file, mappedUidArr)
            //console.log(updatedFile);
            fs.writeFile('exports_bulk_cross_repo/locale/target/' + sourceFilenames[i], JSON.stringify(updatedFile, null, 2), (err) => {
                if (!err) {}                              
            }); 

            const subfolderTo_Zip = Math.trunc(i/200) +1;
                
                fs.writeFile('exports_bulk_cross_repo/locale/to_zip/' + subfolderTo_Zip + "/" + sourceFilenames[i], JSON.stringify(updatedFile, null, 2), (err) => {
                if (err) throw err;
                //console.log('The file has been saved!');
            });                  
            });        
    
            return i;

        }).then(async function(r) {
            console.log("Total json files to archive: ", r);

            const totalSubfoldersTo_Zip = Math.ceil(r / 200);        

            const results = await utilsFolders.makeArchive('exports_bulk_cross_repo/locale/to_zip', "archive", totalSubfoldersTo_Zip);

            return totalSubfoldersTo_Zip;
        });                    
    })      
}

module.exports = {    
    duplicateContent,
    updateContent    
};
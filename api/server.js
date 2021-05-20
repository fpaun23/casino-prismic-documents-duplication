const app = require('./config');
const express = require('express');
const utilsExportBulk = require('./utils/exportBulk');
const utilsExportBulkCrossRepo = require('./utils/exportBulkCrossRepo');
const path = require('path');

const PORT = app.get('port');

app.use(express.static(path.join(__dirname, '../my-app/build')));

app.get('/generate', async function (req, res) {  
  console.log("========================")
  console.log("Request parameters: ", req.query);
  console.log("========================")
  if (req.query.action != "") {

    switch (req.query.action) {

      case 'generate':        
          response = await utilsExportBulk.duplicateContent(req.query.localeFrom, req.query.localeTo); 
        break;
      case 'update':
          response = await utilsExportBulk.updateContent(req.query.localeFrom, req.query.localeTo); 
        break;
      case 'generate_cross_repo':
          response = await utilsExportBulkCrossRepo.duplicateContent(req.query.localeFrom, req.query.localeTo); 
        break;
      case 'update_cross_repo':
          response = await utilsExportBulkCrossRepo.updateContent(req.query.localeFrom, req.query.localeTo); 
        break;        
      default:
        break;    
    }
      res.json("archive");    
  } else {
    res.json("invalid request");
  }
});

app.get('/', (req,res) => {  
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on the port::${PORT}`);
});
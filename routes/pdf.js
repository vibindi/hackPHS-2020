const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const axios = require('axios');

/**
 * 
 * @param {*} name 
 * @param {*} github 
 * @param {*} projects - must be a list of projects
 */
function User(name, github, projects){
    this.name = name;
    //this.email = email;
    this.github = github;
    this.projects = projects;
    /*this.formatNum = function(number){
        // Strip all characters from the input except digits
        number = number.replace(/\D/g,'');
        
        // Trim the remaining input to ten characters, to preserve phone number format
        number = number.substring(0,10);

        // Based upon the length of the string, we add formatting as necessary
        var size = number.length;
        if(size == 0){
            number = number;
        }else if(size < 4){
            number = '('+number;
        }else if(size < 7){
            number = '('+ number.substring(0,3)+') '+ number.substring(3,6);
        }else{
            number = '('+number.substring(0,3)+') - ' + number.substring(3,6)+' - '+ number.substring(6,10);
        }
        return number;
    };

    this.number = this.formatNum(number);*/
}

router.post('/', async (req, res) => {
  const doc = new PDFDocument();
  // Stripping special characters
  filename = "Generated Resume" + '.pdf';
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');
  
  var result = req.app.locals.result;
  var repos = req.app.locals.repos;

  const user = new User("https://github.com/"+result.username, repos);
  
  doc.y = 300;
  doc.fontSize(24).text(user.name, 50, 50);
  doc.lineGap(1).fontSize(12).text(user.email + " | " + user.number + " | " + user.github);
  doc.moveDown(2);
  doc.fontSize(18).text("Projects", {underline:true});
  doc.moveDown();

  for (let proj of user.projects){
    /*langs = [];
    languages = proj.languages;
    for (let x in languages){
        langs.push(x); 
    }*/
    doc.fontSize(14).font('Helvetica-Bold').text(proj.name, {})
    //doc.fontSize(8).font('Helvetica').text(langs.join(","), {});
    doc.lineGap(1).font('Helvetica-Oblique').fontSize(10).text(proj.description, {});
    doc.moveDown();
  }

  doc.addPage();
  doc.text("Created by Vishnu, Scott, Josh, and Timothy for hackPHS 2020", {
    align: 'justify'
  });

  doc.pipe(res);
  doc.end();
});

module.exports = router;
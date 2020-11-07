const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

/**
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} number 
 * @param {*} github 
 * @param {*} projects - must be a list of projects
 */
function User(name, email, number, github, projects){
    this.name = name;
    this.email = email;
    this.github = github;
    this.projects = projects;
    this.formatNum = function(number){
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

    this.number = this.formatNum(number);
}

/**
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} languages - must be a list of languages (make sure they are all legit languages in the input HTML)
 */
function Project(title, description, languages){
    this.title = title;
    this.description = description;
    this.languages = languages;
    this.showProject = function(){
        console.log(title + " " + description + " " + languages);
    };
}

router.post('/', (req, res) => {
  const doc = new PDFDocument();
  let filename = req.body.filename;
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf';
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');
  const content = req.body.content;
  const user1 = new User("Peter Parker", "pparker@queenshs.edu", "291-293-0293", "https://github.com/spiderman", [new Project("Robotics", "Bendy Code", ["Java", "C++"]), new Project("KSVAL", "An open source file format created in python, for python. KSVAL allows for easy key value data pairing with a parsing method similar to CSV.", ["Python"])]);
  doc.y = 300;
  doc.fontSize(24).text(user1.name, 50, 50);
  doc.lineGap(1).fontSize(12).text(user1.email + " | " + user1.number + " | " + user1.github);
  doc.moveDown(2);
  doc.fontSize(18).text("Projects", {underline:true});
  doc.moveDown();

  for (let i = 0; i < user1.projects.length; i++){
    proj = user1.projects[i];
    langs = proj.languages[0];
    for (let x = 1; x < proj.languages.length; x++){
        langs += ", " + proj.languages[x]; 
    }
    doc.fontSize(14).font('Helvetica-Bold').text(proj.title, {})
    doc.fontSize(8).font('Helvetica').text(langs, {});
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

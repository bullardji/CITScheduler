function settingsTest() {
  // Put settings related tests here
  getSettings();
}

function NgetSettings() {
  var settings = {}
  var sheet = SpreadsheetApp.getActive().getSheetByName('Settings');
  var data = sheet.getDataRange().getValues();

  var i = 4; //student iterator
  var k = 2; //other student iterator
  
  
  
  var q = ""; //question
  var r = ""; //required
  var vq = ""; 
  var vr = "";
  var iter = 0; //aray iterator
  
  var ro = 4;
  var col = 11;
  
  var variant = ""; //variant
  
  var it = 0; //variant iterator
  
  var studentQ = [];
  
  var studentQuestion = [];
  var studentRequired = [];
  
  while (i <= 8) {
    k = 2;
    q = data[i][k];

    k++;
    r = data[i][k];
    
  var question1 = {
    question: q,
    required: r,
    volunteerQuestion: vq,
    volunteerRequired: vr,
  };
    
    
    
    
    if(question1.question == "$CLASSES"){
      while(ro < data.length){
        variant = data[ro][col];
        var vari = {
          questions: variant,
        }
        
        if(vari.questions == "" || vari.questions == null){
          ro++;
        }
        else{
          studentQuestion[iter] = vari.questions;
          studentRequired[iter] = "Y";
          iter++;
          ro++;
        }
      }
    }
    
    else{
      studentQuestion[iter] = question1.question;
    }
    
    
    
    
    if (question1.response == "" || null){
      i++;
    }
    
    else{
      studentRequired[iter] = question1.required;
    
      iter++;
      i++;
    }
    
    
  }//end while loop
  
  
  var che = 0;
  
  while(che < studentQuestion.length){
    if(studentQuestion[che] == null){
      che++;
    }
    else{
      studentQ[che] = studentQuestion[che];
      che++;
    }
  }
  
  
  //Logger.log(studentQ);
  return studentRequired
  return studentQuestion
  //Logger.log(studentRequired);
}

function getSettings() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Settings');
  var settings = {};
  settings['studentQuestions'] = getQuestions(sheet, 5);
  settings['volunteerQuestions'] = getQuestions(sheet, 13);
  var classes = [];
  for (var i = 5; i < 11; i++) {
    if (!sheet.getRange(i, 7).isBlank()) {
      var class = {};
      class['class'] = sheet.getRange(i, 7).getValue();
      class['location'] = sheet.getRange(i, 8).getValue();
      class['variant'] = false;
      if (!sheet.getRange(i, 12).isBlank()) {
        class['variant'] = true;
        class['question'] = sheet.getRange(i, 12).getValue();
        class['options'] = getOptions(sheet.getRange(i, 9).getValue());
        class['alternate'] = sheet.getRange(i, 10).getValue();
        class['altRoom'] = sheet.getRange(i, 11).getValue();
      }
      classes.push(class);
    }
  }
  settings['classes'] = classes;
  return settings;
}

function getQuestions(sheet, row){
  var questions = [];
  for (var i = row; i < row + 6; i++) {
    var cell = sheet.getRange(i, 3);
    if (!cell.isBlank()) {
      if (cell.getValue() === '$CLASSES'){
        for (var j = 5; j < 11; j++) {
          if (!sheet.getRange(j, 12).isBlank()) {
            var question = {};
            question['question'] = sheet.getRange(j, 12).getValue();
            question['required'] = true;
            question['class'] = true;
            question['options'] = getOptions(sheet.getRange(j, 9).getValue());
            questions.push(question);
          }
        }
        continue;
      }
      var question = {};
      question['question'] = cell.getValue();
      question['required'] = sheet.getRange(i, 4).getValue() === 'Y';
      questions.push(question);
    }
  }
  return questions;
}

function getOptions(optionsText) {
  var options = [];
  var textTemp = '';
  var indexTemp = 0;
  while (indexTemp < optionsText.length) {
    if (optionsText[indexTemp] === ',') {
      options.push(textTemp);
      textTemp = '';
      while (optionsText[indexTemp + 1] === ' ') {
        indexTemp++;
      }
    } else {
      textTemp += optionsText[indexTemp];
    }
    indexTemp++;
  }
  options.push(textTemp);
  return options;
}

function getSettings_() {
  var settings = {
    "studentQuestions": [{
        "question": "Gender",
        "required": true
      },
      {
        "question": "Current Math Class",
        "required": true,
        "class" : true,
        "options": ["Algebra 1", "Other"]
      },
      {
        "question": "Current School",
        "required": true
      },
      {
        "question": "Are you excited to learn more about the CIT?",
        "required": false
      },
      {
        "question": "Fail example if invalid Required?",
        "required": false
      }
    ],
    "volunteerQuestions": [{
        "question": "Gender",
        "required": true
      },
      {
        "question": "What is your favorite Prime Number?",
        "required": false
      }
    ],
    "classes": [{
        "class": "English",
        "location": "Mrs. Harrel, Room 103",
        "variant": false
      },
      {
        "class": "Geometry",
        "location": "Mrs. Harrel, Room 103",
        "variant": true,
        "question": "Current Math Class",
        "options": [
          "Algebra 1",
          "Other"
        ],
        "alternate": "Algebra 2",
        "altRoom": "Mr. Texler, Room 115"
      },
      {
        "class": "Advisory",
        "location": "Mrs. Kern, Room 201",
        "variant": false
      },
      {
        "class": "Computer Science",
        "location": "Mrs. Norris, Room SC-3",
        "variant": false
      }
    ]
  }
  return settings;
}

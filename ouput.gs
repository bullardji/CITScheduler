function outputTest() {
  // Put output related tests here
  var settings = getSettings();
  makeForm();
  showGroups();
  showSchedule();
  scheduleRow();
}

function makeForm(questions, name) {
  var form = FormApp.create(name);
  form.setCollectEmail(true);

  var validation = FormApp.createTextValidation()
    .requireTextMatchesPattern('.+, .+').build();
  form.addTextItem().setTitle('Name')
    .setValidation(validation)
    .setHelpText('Enter your name as Last, First')
    .setRequired(true);
    
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].class) {
      var question = form.addMultipleChoiceItem();
      question.setTitle(questions[i].question);
      question.setRequired(true);

      var choices = [];
      questions[i].options.forEach(function getChoices(choice) {
        choices.push(choice);
      });
      question.setChoiceValues(choices);
      continue;
    }
    var question = form.addTextItem();
    question.setTitle(questions[i].question);

    if (questions[i].required) {
      question.setRequired(true);
    }
  }

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetApp.getActive().getId());
  var oldActive = SpreadsheetApp.getActiveSheet();
  var sheets = SpreadsheetApp.getActive().getSheets();
  var indx = 0;
  if (sheets[0].getName() === 'Settings') {
    SpreadsheetApp.getUi().alert('The sheets list is invalid. This is a problem on Google\'s end '
                                 + 'and is unfixable. Please take note of the new form sheet added'
                                 + ' in the bottom menu and rename it to "' + name + '" after this '
                                 + 'procedure finishes. The edit link is located at: '
                                 + form.getEditUrl() + ' . Thanks, and we apologize for the inconvenience.');
  } else {
    SpreadsheetApp.getActive().setActiveSheet(sheets[0]);
    SpreadsheetApp.getActive().moveActiveSheet(sheets.length);
    SpreadsheetApp.getActiveSheet().setName(name);
    SpreadsheetApp.getActive().setActiveSheet(oldActive);
  }

  return form;
}

function showGroups(groups, settings) {
  var sheet = SpreadsheetApp.getActive().insertSheet('Groups', SpreadsheetApp.getActive().getSheets().length);
  for (var i = 1; i <= groups.length; i++) {
    var group = groups[i - 1];
    sheet.getRange(i, 1).setValue(i - 1);
    sheet.getRange(i, 2).setValue(group.volunteer['Name']);
    for (var j = 0; j < settings.classes.length; j++) {
      if (settings.classes[j].variant) {
        if (settings.classes[j].options.includes(group.studentOne[settings.classes[j].question]) ||
          (group.studentTwo && settings.classes[j].options.includes(group.studentTwo[settings.classes[j].question]))) {
          sheet.getRange(i, j + 5).setValue(settings.classes[j].class);
          continue;
        }
        sheet.getRange(i, j + 5).setValue(settings.classes[j].alternate);
        continue;
      }
      sheet.getRange(i, j + 5).setValue(settings.classes[j].class);
    }
    sheet.getRange(i, 3).setValue(group.studentOne['Name']);
    if (group.studentTwo) {
      sheet.getRange(i, 4).setValue(group.studentTwo['Name']);
    }
  }
}



function showSchedule(schedule, settings) {
  var sheet = SpreadsheetApp.getActive().insertSheet('Schedule', SpreadsheetApp.getActive().getSheets().length);
  for (var i = 0; i < settings.classes.length; i++) {
    sheet.getRange(1, 2 + i).setValue("Period " + (i + 1));
  }
  var classI = 2;
  settings.classes.forEach(function displayClasses(class) {
    if (class.alternate) {
      sheet.getRange(classI, 1).setValue(class.alternate);
      scheduleRow(schedule[class.alternate], classI, sheet);
      classI++;
    }
    sheet.getRange(classI, 1).setValue(class.class);
    scheduleRow(schedule[class.class], classI, sheet);
    classI++;
  });
}

function scheduleRow(schedule, row, sheet) {
  for (var i = 0; i < schedule.length; i++) {
    var participants = "";
    if (!schedule[i]) {
      continue;
    }
    for (var j = 0; j < schedule[i].length; j++) {
      participants += schedule[i][j];
      if (j < schedule[i].length - 1) {
        participants += ", ";
      }
    }
    sheet.getRange(row, 2 + i).setNumberFormat('@');
    sheet.getRange(row, 2 + i).setValue(participants);
  }
}

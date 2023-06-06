function formTest() {
  // Put form related tests here
  setState('2');
}

function onOpen() {
  var menu = [];
  var state = getState();
  
  if (state == 1) {
    menu = [{name: 'Create Forms', functionName: 'makeForms'}];
  } else if (state == 2) {
    menu = [{name: 'Group Students', functionName: 'groupStudents'}];
  } else if (state == 3) {
    menu = [{name: 'Generate Schedule', functionName: 'generateSchedule'},
            {name: 'Back', functionName: 'undoGroup'}];
  } else if (state == 4){
    menu = [{name: 'Generate Documents', functionName: 'generateDocuments'},
            {name: 'Back', functionName: 'undoSchedule'}];
  }
  menu.push({name: 'Reset', functionName: 'reset'});
  
  SpreadsheetApp.getActive().addMenu('Event', menu);
}

function makeForms() {
  var settings = getSettings();
  var studentForm = makeForm(settings.studentQuestions, 'Form: Student');
  SpreadsheetApp.getUi().alert('Please edit the student form at ' + studentForm.getEditUrl());
  var volunteerForm = makeForm(settings.volunteerQuestions, 'Form: Volunteer');
  SpreadsheetApp.getUi().alert('Please edit the volunteer form at ' + volunteerForm.getEditUrl());
  setState('2');
  onOpen();
}

function groupStudents() {
  var settings = getSettings();
  var ss = SpreadsheetApp.getActive();
  var studentResponses = parse(ss.getSheetByName('Form: Student').getDataRange().getValues());
  var volunteerResponses = parse(ss.getSheetByName('Form: Volunteer').getDataRange().getValues());
  var groups = cluster(studentResponses, volunteerResponses, settings.studentQuestions);
  showGroups(groups, settings);
  setState('3');
  onOpen();
}

function undoGroup() {
  setState('2');
  SpreadsheetApp.getActive().deleteSheet(SpreadsheetApp.getActive().getSheetByName('Groups'));
  onOpen();
}

function generateSchedule() {
  var settings = getSettings();
  var groups = readGroups();
  var schedule = packSchedule(groups, settings);
  showSchedule(schedule, settings);
  setState('4');
  onOpen();
}

function generateDocuments() {
  teacherSchedule();
  volunteerSchedule();
  studentSchedule();
  SpreadsheetApp.getUi().alert('Please check your Google Drive for the Teacher, Volunteer and Student schedules.');
  onOpen();
}

function undoSchedule() {
  setState('3');
  SpreadsheetApp.getActive().deleteSheet(SpreadsheetApp.getActive().getSheetByName('Schedule'));
  onOpen();
}

function reset() {
  setState('1');
  var sheets = SpreadsheetApp.getActive().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() != 'Settings') {
      if (sheets[i].getFormUrl()) {
        FormApp.openByUrl(sheets[i].getFormUrl()).removeDestination();
      }
      SpreadsheetApp.getActive().deleteSheet(sheets[i]);
    }
  }
  onOpen();
}

function getState() {
  return SpreadsheetApp.getActive().getSheetByName('Settings').getDataRange().getValues()[0][0];
}

function setState(state) {
  SpreadsheetApp.getActive().getSheetByName('Settings').getRange('A1').setValue(state);
}

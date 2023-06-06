function teacherSchedule() {
  var settings = getSettings();
  var groups = finalGroups();
  var doc = DocumentApp.create('Teacher Schedules');
  for (var i = 0; i < settings.classes.length; i++) {
    if (settings.classes[i].variant) {
      settings.classes.push({'class': settings.classes[i].alternate, 'location': settings.classes[i].altRoom})
    }
  }
  for (var i = 0; i < settings.classes.length; i++) {
    for (var j = 0; j < groups[0].schedule.length; j++) {
      doc.getBody().appendParagraph(settings.classes[i].location);
      doc.getBody().appendParagraph('Block ' + (j + 1));
      var studentCount = doc.getBody().appendParagraph('Student Count: ');
      var count = 0
      
      var header = [
        ['Student Name','Student Middle School','Present']
      ];
      
      var table = doc.getBody().appendTable(header);
      var headerStyle = {};  
      headerStyle[DocumentApp.Attribute.BOLD] = true;
      
      for (var k = 0; k < groups.length; k++) {
        if (groups[k].schedule[j] === settings.classes[i].class) {
          var newRow = table.appendTableRow();
          var nameCell = newRow.appendTableCell().editAsText().appendText(groups[k].volunteer['Name']);
          newRow.appendTableCell('Deep Run');
          newRow.appendTableCell('');
          count++;
          nameCell.setAttributes(headerStyle)
          
          newRow = table.appendTableRow();
          newRow.appendTableCell(groups[k].student1['Name']);
          newRow.appendTableCell(groups[k].student1['Current School']);
          newRow.appendTableCell('');
          count++;
          
          if (groups[k].student2) {
            newRow = table.appendTableRow();
            newRow.appendTableCell(groups[k].student2['Name']);
            newRow.appendTableCell(groups[k].student2['Current School']);
            newRow.appendTableCell('');
            count++;
          }
        }
      }
      
      doc.getBody().appendPageBreak();
      
      studentCount.appendText(count);
    }
  }
  
  doc.getBody().editAsText().deleteText(0, 0);
}

function volunteerSchedule() {
  var settings = getSettings();
  var groups = finalGroups();
  var doc = DocumentApp.create('Volunteer Schedules');
  
  for (var i = 0; i < settings.classes.length; i++) {
    if (settings.classes[i].variant) {
      settings.classes.push({'class': settings.classes[i].alternate, 'location': settings.classes[i].altRoom})
    }
  }
  for (var i = 0; i < groups.length; i++) {
    doc.getBody().appendParagraph(groups[i].volunteer['Name']);
    doc.getBody().appendParagraph('');
    doc.getBody().appendParagraph('Student 1: ' + groups[i].student1['Name'].split(/[ ,]+/)[1] +
      ' ' + groups[i].student1['Name'].split(/[ ,]+/)[0] + ', ' + groups[i].student1['Current School']);
    Object.keys(groups[i].student1).forEach(function outputStudentInfo(info) {
      if (!['Timestamp', 'Email Address', 'Name', 'Gender', 'Current School'].includes(info)) {
        doc.getBody().appendParagraph('\t' + info + ': ' + groups[i].student1[info]);
      }
    });
    
    if (groups[i].student2) {
      doc.getBody().appendParagraph('');
      doc.getBody().appendParagraph('Student 2: ' + groups[i].student2['Name'].split(/[ ,]+/)[1] +
        ' ' + groups[i].student2['Name'].split(/[ ,]+/)[0] + ', ' + groups[i].student2['Current School']);
      Object.keys(groups[i].student2).forEach(function outputStudentInfo(info) {
        if (!['Timestamp', 'Email Address', 'Name', 'Gender', 'Current School'].includes(info)) {
          doc.getBody().appendParagraph('\t' + info + ': ' + groups[i].student2[info]);
        }
      });
    }
    
    doc.getBody().appendParagraph('');
    
    var table = [];
    
    var header = [];
    for (var j = 0; j < groups[i].schedule.length; j++) {
      header.push('Block ' + (j + 1));
    }
    table.push(header);
    
    var class = [];
    for (var j = 0; j < groups[i].schedule.length; j++) {
      var classTeacher = settings.classes.find(function findClassByName(class) {
        return class.class === groups[i].schedule[j];
      });
      class.push(classTeacher.location);
    }
    table.push(class);
    
    var course = [];
    for (var j = 0; j < groups[i].schedule.length; j++) {
      course.push(groups[i].schedule[j]);
    }
    table.push(course);

    doc.getBody().appendTable(table);

    doc.getBody().appendPageBreak();
  }
  
  doc.getBody().editAsText().deleteText(0, 0);
}

function studentSchedule() {
  var settings = getSettings();
  var groups = finalGroups();
  var doc = DocumentApp.create('Student Schedules');
  doc.getBody().clear();
  
  for (var i = 0; i < settings.classes.length; i++) {
    if (settings.classes[i].variant) {
      settings.classes.push({'class': settings.classes[i].alternate, 'location': settings.classes[i].altRoom})
    }
  }
  
  var students = [];
  for (var i = 0; i < groups.length; i++) {
    var newStudent = {};
    newStudent = groups[i].student1;
    newStudent.volunteer = groups[i].volunteer;
    newStudent.schedule = groups[i].schedule;
    if (groups[i].student2) {
      newStudent.partner = groups[i].student2;
    }
    students.push(newStudent);
    
    if (groups[i].student2) {
      newStudent = {};
      newStudent = groups[i].student2;
      newStudent.volunteer = groups[i].volunteer;
      newStudent.schedule = groups[i].schedule;
      newStudent.partner = groups[i].student1;
      students.push(newStudent);
    }
  }
  
  for (var i = 0; i < students.length; i++) {
    doc.getBody().appendParagraph(students[i]['Name']);
    doc.getBody().appendParagraph(students[i]['Current Math Class']);
    doc.getBody().appendParagraph(students[i]['Current School']);
    doc.getBody().appendParagraph('');
    doc.getBody().appendParagraph('Mentor: ' + students[i].volunteer['Name'].split(/[ ,]+/)[1] +
      ' ' + students[i].volunteer['Name'].split(/[ ,]+/)[0]);
    Object.keys(students[i].volunteer).forEach(function outputVolunteerInfo(info) {
      if (!['Timestamp', 'Email Address', 'Name', 'Gender', 'Current School'].includes(info)) {
        doc.getBody().appendParagraph('\t' + info + ': ' + students[i].volunteer[info]);
      }
    });
    
    if (students[i].partner) {
      doc.getBody().appendParagraph('');
      doc.getBody().appendParagraph('Partner: ' + students[i].partner['Name'].split(/[ ,]+/)[1] +
        ' ' + students[i].partner['Name'].split(/[ ,]+/)[0] + ', ' + students[i].partner['Current School']);
      Object.keys(students[i].partner).forEach(function outputPartnerInfo(info) {
        if (!['Timestamp', 'Email Address', 'Name', 'Gender', 'Current School', 'volunteer', 'schedule', 'partner'].includes(info)) {
          doc.getBody().appendParagraph('\t' + info + ': ' + students[i].partner[info]);
        }
      });
    }
    
    doc.getBody().appendParagraph('');
    
    var table = [];
    
    var header = [];
    for (var j = 0; j < students[i].schedule.length; j++) {
      header.push('Block ' + (j + 1));
    }
    table.push(header);
    
    var class = [];
    for (var j = 0; j < students[i].schedule.length; j++) {
      var classTeacher = settings.classes.find(function findStudentClassByName(class) {
        return class.class === students[i].schedule[j];
      });
      class.push(classTeacher.location);
    }
    table.push(class);
    
    var course = [];
    for (var j = 0; j < students[i].schedule.length; j++) {
      course.push(students[i].schedule[j]);
    }
    table.push(course);
      
    doc.getBody().appendTable(table);
       
    doc.getBody().appendPageBreak();
  }
  
  doc.getBody().editAsText().deleteText(0, 0);
}

function finalGroups() {
  var settings = getSettings();
  var ss = SpreadsheetApp.getActive();
  var studentResponses = parse(ss.getSheetByName('Form: Student').getDataRange().getValues());
  var volunteerResponses = parse(ss.getSheetByName('Form: Volunteer').getDataRange().getValues());
  var groups = readGroups();
  groups.forEach(function populateScheduleArrays(group) {
    group.schedule = new Array(settings.classes.length);
  });

  var scheduleTable = ss.getSheetByName('Schedule').getDataRange().getValues();
  for (var i = 1; i < scheduleTable.length; i++) {
    var class = scheduleTable[i][0];
    for (var j = 1; j < scheduleTable[i].length; j++) {
      var participants = scheduleTable[i][j].split(/[ ,]+/);
      if (participants[0] === "") {
        continue;
      }
      for (var k = 0; k < participants.length; k++) {
        groups[parseInt(participants[k], 10)].schedule[j - 1] = class;
      }
    }
  }

  for (var i = 0; i < groups.length; i++) {
    groups[i].volunteer = volunteerResponses.find(function findVolunteerObject(volunteer) {
      return volunteer['Name'] === groups[i].volunteer;
    });

    groups[i].student1 = studentResponses.find(function findStudent1Object(student) {
      return student['Name'] === groups[i].student1;
    });

    if (groups[i].student2) {
      groups[i].student2 = studentResponses.find(function findStudent2Object(student) {
        return student['Name'] === groups[i].student2;
      });
    }
  }

  return groups;
}

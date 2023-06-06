function schedulingTest() {
  showSchedule(packSchedule(readGroups(), getSettings()), getSettings());
}

function readGroups() {
  var groups = [];
  var sheet = SpreadsheetApp.getActive().getSheetByName('Groups');
  var index = 1;
  while (!sheet.getRange(index, 1).isBlank()) {
    var classes = [];
    var offset = 5;
    while (!sheet.getRange(index, offset).isBlank()) {
      classes.push(sheet.getRange(index, offset).getValue());
      offset++;
    }
    var i = sheet.getRange(index, 1).getValue();
    groups[i] = {
      classes: classes
    };
    groups[i].volunteer = sheet.getRange(index, 2).getValue();
    groups[i].student1 = sheet.getRange(index, 3).getValue();
    if (!sheet.getRange(index, 4).isBlank()) {
      groups[i].student2 = sheet.getRange(index, 4).getValue();
    }
    index++;
  }
  return groups;
}

function packSchedule(groups, settings) {
  var schedule = {};
  var times = settings.classes.length;
  settings.classes.forEach(function getClasses(class) {
    if (class.alternate) {
      schedule[class.alternate] = Array(times);
    }
    schedule[class.class] = Array(times);
  });

  for (var i = 0; i < groups.length; i++) {
    var slots = Array(times).fill(true);
    groups[i].classes.forEach(function fillClasses(class) {
      var localSchedule = schedule[class];
      var least = -1;
      if (i % 2 == 0) {
        for (var j = 0; j < times; j++) {
          if (!localSchedule[j]) {
            localSchedule[j] = Array();
          }
          least = checkMin(localSchedule, slots, least, j);
        }
      } else {
        for (var j = times - 1; j >= 0; j--) {
          if (!localSchedule[j]) {
            localSchedule[j] = Array();
          }
          least = checkMin(localSchedule, slots, least, j);
        }
      }
      localSchedule[least].push(i);
      slots[least] = false;
    });
  }
  return schedule;
}

function checkMin(localSchedule, slots, least, j) {
  if (slots[j]) {
    if (least < 0 || localSchedule[least].length > localSchedule[j].length) {
      return j;
    }
  }
  return least;
}

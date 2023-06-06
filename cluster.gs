function clusterTest() {
  var settings = getSettings();
  var ss = SpreadsheetApp.getActive();
  var studentResponses = parse(ss.getSheetByName('Form: Student').getDataRange().getValues());
  var volunteerResponses = parse(ss.getSheetByName('Form: Volunteer').getDataRange().getValues());
  var groups = cluster(studentResponses, volunteerResponses, settings.studentQuestions);
  showGroups(groups, settings);
}

function cluster(students, volunteers, questions) {
  var groupCount = Math.ceil(students.length / 2)
  var groups = [];

  while (students.length > 0) {
    var newGroup = {};
    newGroup.studentOne = students.shift();
    if (students.length === 0) {
      groups.push(newGroup);
      continue;
    }

    var selection = match(students, newGroup.studentOne, questions);
    if (selection[1] < 1) {
      groups.push(newGroup);
      continue;
    }
    
    newGroup.studentTwo = students[selection[0]];
    students.splice(selection[0], 1);
    groups.push(newGroup);
  }

  groups.forEach(function assignVolunteer(group) {
    if (volunteers.length === 0) {
      throw "Error: Not enough volunteers";
    }
    var volunteer = match(volunteers, group.studentOne, questions);
    if (group.studentTwo) {
      var volunteerTwo = match(volunteers, group.studentTwo, questions);
      if (volunteerTwo[1] > volunteer[1]) {
        volunteer = volunteerTwo;
      }
    }
    if (volunteer[1] < 1) {
      throw "Error: Not enough volunteers to match first critera";
    }
    group.volunteer = volunteers[volunteer[0]];
    volunteers.splice(volunteer[0], 1);
  });

  return (groups);
}

function match(applicants, base, questions) {
  var candidates = [];
  for (var i = 0; i < applicants.length; i++) {
    candidates[i] = i;
  }

  var test = 0;
  var selection;
  while (candidates.length > 0 && test < questions.length) {
    selection = candidates[0];
    var question = questions[test].question;
    test++;
    if (!applicants[0][question] || !base[question]) {
      continue;
    }
    candidates = candidates.filter(function applyFilter(candidate) {
      return applicants[candidate][question] == base[question];
    });
  }
  return [selection, test - 1];
}

function parse(values) {
  var entries = [];
  for (var i = 1; i < values.length; i++) {
    var entry = {};
    for (var j = 0; j < values[i].length; j++) {
      entry[values[0][j]] = values[i][j];
    }
    entries.push(entry);
  }
  return (entries);
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

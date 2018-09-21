  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC4302VzuzWrzMYxqvkgZITb4AulC_mmQQ",
    authDomain: "train-scheduler-1c977.firebaseapp.com",
    databaseURL: "https://train-scheduler-1c977.firebaseio.com",
    projectId: "train-scheduler-1c977",
    storageBucket: "train-scheduler-1c977.appspot.com",
    messagingSenderId: "1007731290219"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//Capture Button Click
$("#add-train").on("click", function () {
  event.preventDefault();

  //Values from text inputs
var trainName = $("#trainName").val().trim();
var destination = $("#destination").val().trim();
var firstTrain = moment($("#firstTrain").val().trim(),"HH:mm").subtract(1, "years").format("X");
var frequency = $("#frequency").val().trim();
  
console.log(firstTrain);

  //Code for handling the push
var newTrain = {
  name: trainName,
  destination: destination,
  firstTrain: firstTrain,
  frequency: frequency
}
  database.ref().push(newTrain);

  return false;
});

//Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Console.loging the last train's data
  console.log(sv.name);
  console.log(sv.destination);
  console.log(sv.firstTrain);
  console.log(sv.frequency);

  var remainder = moment().diff(moment.unix(sv.firstTrain),"minutes")%sv.frequency;
  var minutes = sv.frequency - remainder;
  var arrival = moment().add(minutes,"m").format("hh:mm A");

  //========= Console.log math ================================

  console.log(remainder);
  console.log(minutes);
  console.log(arrival);

  //Current Time
  var currentTime = moment();

  //======== Display in table =======================

  var tr = $("<tr>");

  var tdTrainName = $("<td>");
    tdTrainName.text(sv.name);
    tr.append(tdTrainName);

  var tdDestination = $("<td>");
    tdDestination.text(sv.destination);
    tr.append(tdDestination);

  var tdFrequency = $("<td>");
    tdFrequency.text(sv.frequency);
    tr.append(tdFrequency);
  
  var tdNextArrival = $("<td>");
    tdNextArrival.text(arrival);
    tr.append(tdNextArrival);

  var tdMinutesAway = $("<td>");
    tdMinutesAway.text(minutes);
    tr.append(tdMinutesAway)


  
  $("#train-info").append(tr);

  },
  //Handle the errors
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

Parse.initialize(
  "iIkl8eKIcL46ycizWYpL86P5YAGGcx38PC0c2FLu",
  "dyxXuOUYCGIVHSBrxyEfsjDQNI5HUSKBdFOi8DTK"
);
Parse.serverURL = "https://parseapi.back4app.com/";

function onSubmit() {
  var validata = document.forms["loginform"]["username"].value;
  var passvalidata = document.forms["loginform"]["password"].value;
  if (
    validata == "" ||
    validata == null ||
    passvalidata == "" ||
    passvalidata == null
  ) {
    document.getElementById("demo").innerHTML =
      "Please fill out all the fields";
  } else {
    var user = Parse.User.logIn(validata,passvalidata)
      .then(function (user) {
        console.log(
          "User signin successful with name: " +
            user.get("username") +
            " and email: " +
            user.get("email")
        );
        window.location.href = "pages/home.html";
      })
      .catch(function (error) {
        console.log("Error: " + error.code + " " + error.message);
      });
  }
}

function signup() {
  window.location.href = "pages/signup.html";
}

function forgot() {
  window.location.href = "pages/forgotpass.html";
}

function logIn() {
  // Create a new instance of the user class
  var user = Parse.User.logIn(" redirect test3", "my pass")
    .then(function (user) {
      console.log(
        "User signin successful with name: " +
          user.get("username") +
          " and email: " +
          user.get("email")
      );
      window.location.href = "home.html";
    })
    .catch(function (error) {
      console.log("Error: " + error.code + " " + error.message);
    });
}

function login() {
  window.location.href = "../index.html";
}

Parse.initialize(
  "iIkl8eKIcL46ycizWYpL86P5YAGGcx38PC0c2FLu",
  "dyxXuOUYCGIVHSBrxyEfsjDQNI5HUSKBdFOi8DTK"
);
Parse.serverURL = "https://parseapi.back4app.com/";

function signUp() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var pass = document.getElementById("password").value;
  console.log("button clicked");
  // Create a new instance of the user class
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", pass);
  user.set("email", email);

  // other fields can be set just like with Parse.Object
  user.set("phone", "415-392-0202");

  user
    .signUp()
    .then(function (user) {
      console.log(
        "User created successful with name: " +
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

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const Razorpay = require("razorpay");
const userRoutes = require("./users");

if ( process.env.NODE_ENV !== "production" ) {
    require("dotenv").config()
}


mongoose.connect("mongodb+srv://varad:varad@cluster0.nceqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => {console.log("Mongoose Connection Open...")})
    .catch((err) => {console.log("Mongoose Connection Error...", err)})


app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: "secretCode", resave: false, saveUninitialized: false, cookie: {expires: Date.now()+1000*60*60*24*7}}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// payment gateway

const razorpay = new Razorpay({
    key_id: "rzp_test_VxD1zQcadP2eYr",
    key_secret: "2HhrDsotI695EYb35zI3WW4G",
});

app.use(express.urlencoded({ extended: true}))

app.use("/", userRoutes);

app.post("/order", (req, res) => {
    let options = {
      amount: 500 * 100, // amount in the smallest currency unit
      currency: "INR",
    };
  
    razorpay.orders.create(options, function (err, order) {
      res.json(order);
    });
    console.log("blahhhhhhh")

  });
  
app.post("/is-order-complete", (req, res) => {
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymenDocument) => {
        console.log(paymenDocument)
  
        if(paymenDocument.status == 'captured'){
            res.send('payment success');
            console.log(info.data.id);
        }else{
            res.send('')
        }
        req.flash("success", "Successfully placed your order.")
    });
  });


app.get("/home", (req, res) => {
    res.render("home", { user: req.session.user_id })
})

app.get("/home/:id", (req, res) => {
    res.render("home", { id: req.params.id, user: req.session.user_id })
})

app.listen(8080, () => {
    console.log("Serving on port 8080...")
});

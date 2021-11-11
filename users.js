const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const multer = require("multer")
const {storage} = require("./cloudinary")
const upload = multer({storage})
const User = require("./models/user");
const Bulk = require("./models/bulk");
const Order = require("./models/order");
const Shipment = require("./models/shipment");

if ( process.env.NODE_ENV !== "production" ) {
    require("dotenv").config()
}

router.get("/signup", (req, res) => {
    res.render("signup")
})

router.post("/signup", async (req, res) => {
    const { email, username, password} = req.body
    try {
        const hash = await bcrypt.hash(password, 12)
        const newUser = new User({ email, name: username, password: hash })
        console.log(newUser)
        const user = await newUser.save()
        console.log(user)
        req.session.user_id = user._id
        req.flash("success", "Successfully registered.")
        res.redirect(`/home/${user._id}`)
    }
    catch (error) {
        console.log(error)
        req.flash("error", "Could not register user.")
        res.redirect("/signup")
    }
})

router.get("/login", (req, res) => {
    res.render("Login")
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        req.flash("error", "Username or password is incorrect.")
        res.redirect("/login")
    }
    else {
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            req.flash("error", "Username or password is incorrect.")
            res.redirect("/login")
        }
        else {
            req.session.user_id = user._id
            // res.send("This is homepage")
            res.redirect(`/home/${user._id}`)
        }
    }
})
-
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/home")
})

router.get("/user/dashboard/:id", async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).populate("orders")
    if (user.orders.length) {
        console.log(user.orders)
    }
    else {
        console.log("no orders")
    }
    const orders = user.orders;
    res.render("dashboard", { id: req.params.id, orders });
})

router.get("/products", (req, res) => {
    res.render("catalogue")
})

router.get("/services", (req, res) => {
    res.render("design_services", { user: req.session.user_id })
})

router.get("/bulk-orders", (req, res) => {
    res.render("bulk_orders", { user: req.session.user_id })
})

router.get("/bulk-orders/:id", (req, res) => {
    res.render("bulk_orders", { id:  req.params.id, user: req.params.id })
})

router.post("/bulk-orders", async (req, res) => {
    const { name, email, message } = req.body
    const bulk = new Bulk({ name, email, message })
    const savedBulk = await bulk.save()
    console.log(savedBulk)
    res.redirect(`/bulk-orders`)
})
router.post("/bulk-orders/:id", async (req, res) => {
    const { name, email, message } = req.body
    const bulk = new Bulk({ name, email, message })
    const savedBulk = await bulk.save()
    console.log(savedBulk)
    res.redirect(`/bulk-orders/${req.params.id}`)
})

router.get("/user/my-designs/:id", async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).populate("orders")
    if (user.orders.length) {
        console.log(user.orders)
    }
    else {
        console.log("no orders")
    }
    const orders = user.orders;
    res.render("my_designs", { id:  req.params.id, orders })
})


router.get("/settings/user-profile/:id", (req, res) => {
    res.render("user_profile", { id:  req.params.id })
})

router.post("/settings/user-profile/:id", async (req, res) => {
    const { name, email, phone } = req.body
    const user = await User.findOneAndUpdate({_id: req.session.user_id}, {name, email, phone})
    const savedUser = await user.save()
    console.log(savedUser)
    res.redirect(`/settings/user-profile/${req.params.id}`)
})

router.get("/settings/business-details/:id", (req, res) => {
    res.render("business_details",  { id:  req.params.id })
})

router.post("/settings/business-details", async (req, res) => {
    const {businessName, brandName, country, address1, address2, city, state, pincode, gstin, website } = req.body
    const user = await User.findOneAndUpdate({_id: req.session.user_id}, {businessName, brandName, country, address1, address2, city, state, pincode, gstin, website })
    const savedUser = await user.save()
    console.log(savedUser)
    res.redirect(`/settings/business-details/${req.params.id}`)
})

// router.get("/settings/user-shipping", (req, res) => {

//     res.render("user_shipping")
// })

// router.post("/settings/user-shipping", upload.single("image"), async (req, res) => {
//     const {brandName} = req.body
//     const user = await User.findOneAndUpdate({_id: req.session.user_id}, {brandName})
//     console.log(req.file, user)
//     user.logo.url = req.file.path
//     user.logo.filename = req.file.filename
//     const savedUser = await user.save()
//     console.log(savedUser)
//     res.redirect("/settings/user-shipping")
// })

router.get("/support", (req, res) => {
    res.render("customer_support", { user: req.session.user_id })
})

router.get("/about", (req, res) => {
    res.render("Aboutus", { user: req.session.user_id })
})

router.get("/policies", (req, res) => {
    res.render("policies", { user: req.session.user_id })
})

router.get("/pod", (req, res) => {
    res.render("pod", { user: req.session.user_id })
})

router.get("/user/mockup/tshirt/:id", (req, res) => {
    res.render("mockup_tshirt", { id:  req.params.id })
})

router.post("/user/mockup/tshirt/:id", upload.single("image"), async (req, res) => {
    const { designName, color, quantity, printType, remark, printPrice } = req.body
    let pPrice = parseInt(printPrice.split("/")[0])

    const order = new Order({ designName, color, quantity, printType, remark, printPrice: pPrice })
    order.type = "T-shirt"
    order.design.url = req.file.path
    order.design.filename = req.file.filename
    order.design.filename = req.file.filename
    order.price = quantity*150 + pPrice + 60
    const savedOrder = await order.save()
    // console.log(savedOrder)
    res.redirect(`/user/shipment/${req.params.id}/${savedOrder._id}`)
})

router.get("/user/mockup/sweatshirt/:id", (req, res) => {
    res.render("mockup_sweatshirt", { id:  req.params.id })
})

router.post("/user/mockup/sweatshirt/:id", upload.single("image"), async (req, res) => {
    let { designName, color, quantity, printType, remark, printPrice } = req.body
    let pPrice = parseInt(printPrice.split("/")[0])
    const order = new Order({ designName, color, quantity, printType, remark, printPrice: pPrice })
    order.type = "Sweatshirt"
    order.design.url = req.file.path
    order.design.filename = req.file.filename
    order.design.filename = req.file.filename
    order.price = quantity*190 + pPrice + 60
    const savedOrder = await order.save()
    console.log(savedOrder)
    res.redirect(`/user/shipment/${req.params.id}/${savedOrder._id}`)

})

router.get("/user/mockup/hoodie/:id", (req, res) => {
    res.render("mockup_hoodie", { id:  req.params.id })
})

router.post("/user/mockup/hoodie/:id", upload.single("image"), async (req, res) => {
    const { designName, color, quantity, printType, remark, printPrice } = req.body
    let pPrice = parseInt(printPrice.split("/")[0])
    const order = new Order({ designName, color, quantity, printType, remark, printPrice: pPrice })
    order.type = "Hoodie"
    order.design.url = req.file.path
    order.design.filename = req.file.filename
    order.price = quantity*220 + pPrice + 60
    const savedOrder = await order.save()
    // console.log(savedOrder)
    res.redirect(`/user/shipment/${req.params.id}/${savedOrder._id}`)
})

router.get("/user/shipment/:id/:orderId", async (req, res) => {
    const { id, orderId } = req.params
    const order = await Order.findOne({_id: orderId})
    console.log(order)
    res.render("checkout", { id, orderId, order })
})

router.post("/user/shipment/:id/:orderId", async (req, res) => {
    const { customerName, email, phone, address1, address2, city, state, pincode, orderPrice } = req.body
    const orderId = req.params.orderId
    const shipment = new Shipment({ customerName, email, phone, address1, address2, city, state, pincode, orderPrice })
    const savedShipment = await shipment.save()
    const order = await Order.findById(orderId)
    order.shipmentId = savedShipment._id
    const savedOrder = await order.save()
    console.log(savedShipment)
    console.log(savedOrder)
    const user = await User.findOne({_id: req.params.id})
    user.orders.push(savedOrder)
    await user.save()
    res.redirect(`/user/shipment/${req.params.id}/${savedOrder._id}`)
})




module.exports = router;
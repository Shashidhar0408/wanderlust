const express = require("express");
const router = express.Router();

// Index route for users 
router.get("/",  (req, res) => {
    res.send("GET For users")
})

// SHOW ROUTE FOR USERS 
router.get("/:id",  (req, res) => {
    res.send("GET For show  user id")
})
// POST ROUTE FOR USERS
router.post("/", (req, res) => {
    res.send("POST For Users")
})
//DELETE ROute for users
router.delete("/:id",  (req, res) => {
    res.send("DELETE from users")
})


module.exports = router;
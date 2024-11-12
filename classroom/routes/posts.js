const express = require("express");
const router = express.Router();


// Index route for posts 
router.get("/",  (req, res) => {
    res.send("GET For Posts")
})

// SHOW ROUTE FOR posts 
router.get("/:id",  (req, res) => {
    res.send("GET For show post id")
})
// POST ROUTE FOR posts
router.post("/", (req, res) => {
    res.send("POST For Posts")
})
//DELETE ROute for posts
router.delete("/:id",  (req, res) => {
    res.send("DELETE from Posts")
})



module.exports = router;
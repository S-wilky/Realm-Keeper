const express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 5000;
// import supabase from ".../frontend/src/services/supabase-client";

router.get("/", /*async*/ (req, res) => {
    /*
    const {data, error} = await supabase
        .from('users')
        .select()
    */
    res.send({ data: "Here is your data" });
});

router.get("/:id", /*async*/ (req, res) => {
    /*
    const {data, error} = await supabase
        .from('users')
        .select()
        .is('id', req.params.id)
    */
    res.send({ data: "Here is your data ${id}" });
});

router.post("/", /*async*/ (req, res) => {
    /*
    const {error} = await supabase
        .from('users')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
    if (error) {
        res.send(error);
    }
    res.send("created!!");
    */
    res.send({ data: "User added" });
});

router.put("/:id", /*async*/ (req, res) => {
    /*
    const {error} = await supabase
        .from('users')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("updated!!");
    */
    res.send({ data: "User updated" });
});

router.delete("/", /*async*/ (req, res) => {
    /*
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("deleted!!")
    */
    res.send({ data: "User deleted" });
});

module.exports = router;
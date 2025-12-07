const express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 5000;
import supabase from ".../frontend/src/services/supabase-client";

router.get("/", (req, res) => {
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

router.get("/auth/callback", async function (req, res) {
  const code = req.query.code
  const next = req.query.next ?? "/"
  if (code) {
//     const supabase = createServerClient(
//       process.env.SUPABASE_URL,
//       process.env.SUPABASE_PUBLISHABLE_KEY, {
//     cookies: {
//       getAll() {
//         return parseCookieHeader(context.req.headers.cookie ?? '')
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value, options }) =>
//           context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
//         )
//       },
//     },
//   })
    await supabase.auth.exchangeCodeForSession(code)
  }
  res.redirect(303, `/${next.slice(1)}`)
})

module.exports = router;
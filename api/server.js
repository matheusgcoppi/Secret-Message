const express = require('express');
const router = require('./routes.js');
const app = express();
const port = process.env.PORT || 8000

app.use(express.json())

app.use(require('./routes.js'))
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})

router.get("/", (req, res) => {
    return res.status(200).send("teste")
})
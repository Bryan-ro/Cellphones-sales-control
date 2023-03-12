const app = require("./src/app.js");

const port = process.env.PORT || 4444;

app.listen(port, () => {
    console.log("listening on port " + port);
})
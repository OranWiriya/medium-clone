const express = require('express');
const app = express();
const cors = require('cors');
const db = require('../backend/models');
const userRoutes = require("./routes/User.js")
const articleRoutes = require("./routes/Article.js")
const commentRoutes = require("./routes/Comment.js")

require("./config/passport.js")

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/articles',articleRoutes);
app.use('/comments',commentRoutes);
app.use("/users",userRoutes);

db.sequelize.sync({ force: true }).then(() => {
    app.listen(8000, () => {
        console.log(`Server is running at port 8000`);
    });
});
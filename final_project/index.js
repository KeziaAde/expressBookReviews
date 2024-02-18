const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Place session middleware before any routes that require sessions
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        console.log(token);

        jwt.verify(token, "book_list_member", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                console.error("JWT verification failed:", err);
                return res.status(403).json({ error: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ error: "User not logged in" });
    }
});

// Use your routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

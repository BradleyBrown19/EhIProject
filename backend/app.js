const express = require('express');

const app = express();

app.use('/api/comments', (req, res, next) => {
    const comments = [
        {id: "5g545df", title: "FIRST POST!", content: "this is a post"},
        {id: "4dsagd54", title: "Second post", content: "Slighlty less exciting."}
    ]
    res.status(200).json({
        message: "Comments fetched successfully",
        comments: comments
    });
});

module.exports = app;
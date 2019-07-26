const express = require('express');
const Comment = require('../models/comment')
const router = express.Router();

router.post("", (req, res, next) => {
    const comment = new Comment({
        title: req.body.title,
        content: req.body.content,
        topic: req.body.topic
    });

    comment.save().then(result => {
        res.status(201).json({
            message: 'Post added successfully',
            commentId: result._id
        });
    });
});

router.delete("/:id", (req, res, next) => {
    console.log(req.params.id);
    Comment.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'post deleted'});
    });
});

router.put("/:id", (req, res, next) =>  {
    const comment = new Comment({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        topic: req.body.topic,
    });
    Comment.updateOne({_id: req.params.id}, comment).then(result => {
        console.log(result);
        res.status(200).json({message: "Comment updated"});
    })
});

router.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const topic = req.query.topic
    const commentQuery = Comment.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        commentQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    if (topic != 'all') {
        commentQuery.where('topic').equals(topic)
    }

    commentQuery.then(documents => {
        fetchedPosts = documents;
        return Comment.count();
    })
    .then(count => {
        res.status(200).json({
            message: "Comments fetched successfully",
            comments: fetchedPosts,
            maxPosts: count
        });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const config = require('../config')

router.get("/:docName", function (req, res, next) {
    console.log('name:' + req.params.docName);
    if (path.extname(req.params.docName) == ".md") {
        fs.readFile(config.RelativePath + req.params.docName, function (err, data) {
            if (err) {
                console.log("文件不存在！");
                res.send("文件不存在！");
            } else {
                console.log(data);
                htmlStr = marked(data.toString());
                // console.log(htmlStr);
                res.render('doc', { doc: htmlStr });
            }
        });
    } else {
        console.log(config.RelativePath + req.url);
        res.sendFile(config.RelativePath + req.url);
    }
});

module.exports = router;
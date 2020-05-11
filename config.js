const path = require('path');

var config = {};
//                                        ↓↓↓修改为你自己的路径↓↓↓
config.RelativePath = path.join(__dirname, '/public/markdown/'/*replace to your directory...*/);
console.log('relative path:' + config.RelativePath);

module.exports = config;
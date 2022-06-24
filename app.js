var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;
app.set('port', port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));


var user = require('./routes/user');
var province = require('./routes/province');
var voucher = require('./routes/voucher');
var product = require('./routes/product');
var category = require('./routes/category');

app.use('/user', user);
app.use('/province', province);
app.use('/voucher', voucher);
app.use('/product', product);
app.use('/category', category);

app.use('/', (req, res) => {
  res.send('Hello World!')
})
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const uri = "mongodb+srv://hoanghoang:hoanghoang123@cluster0.gznnk.mongodb.net/evalley?retryWrites=true&w=majority"
const options = {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
};

mongoose.connect(uri, options)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
module.exports = app;
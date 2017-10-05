var mongoose = require('mongoose'), ejs = require('ejs')

var Product = require('../Models/product.js');

var express=require('express');

module.exports = function(app) {


    app.get('/Product', (req, res) => {
        ejs.renderFile('./view/Product.ejs', {}, (err, html) => {
            res.end(html);
        });
    });


    app.get('/ProductList', function(req, res) {

     

        //----------HAM TIM KIEM THEO TEN------------------------//
        
        if(req.query.search && req.query.search.length > 0){
        
         Product.find({name: {$regex: ".*" + req.query.search + "*"}}, function(err, products) {
             if (err)
                  res.send(err);
                    ejs.renderFile('./view/ProductList.ejs', {products}, (err, html) => {
                         res.end(html);
                           });
                      });
            return ;
            

        }

        //-----------------HAM TIM KIEM THEO KHOANG GIA --------------------------//




        if(req.query.minprice && req.query.maxprice){
            console.log('chay dc if seach');

            var queryFP = req.query.minprice;
            var queryLP = req.query.maxprice;


            console.log('start find');
            Product.find({}).where('price').gt(queryFP-1).lt(queryLP+1).exec((err, products)=> {
              
                console.log('khong co loi nhung ko chay dc')
                ejs.renderFile('./view/ProductList.ejs', {products }, (err, html) => {
                    res.end(html);
                });

            });
          



        }


        

            console.log('ko chay dc if');
            Product.find(function(err,products){
                ejs.renderFile('./view/ProductList.ejs',{products},(err, html) => {
                    res.end(html)
                })
            })  

    

        });





    //---------------------------------POST Product---------------------------------------------



    app.post('/Product', (req, res,done) => {
        const tmp = req.body;
        var errMes = "";

        if (!tmp.name) {
            errMes += " Enter Product's Name. Please !!!";

        }
        if (!tmp.description) {
            errMes += " Enter Product's description. Please!!! ";
        }
        if (!tmp.price) {
            errMes += " Enter Product's price. Please!!! ";
        }
        if (errMes) {
            ejs.renderFile('./view/Product.ejs', { errMes: errMes }, (err, html) => {
                res.end(html);
            });
        }

         else {
            var newProduct = new Product();
            newProduct.name = req.body.name;
            newProduct.description = req.body.description;
            newProduct.price = req.body.price;
            newProduct.save(function(err){
        if (err)
        return ejs.renderFile('./view/Product.ejs', { errMes: err.message }, (err, html) => {
                res.end(html);
            });

      res.redirect('/Product');
            })
        }
        
    });



  //----------------Ham Delete Product theo ID-----------------------//  


app.delete('/ProductList/:_id', function(req, res){
    Product.findByIdAndRemove({_id: req.params._id}, 
       function(err, docs){
        if(err) res.json(err);
        else    res.redirect('/ProductList');
    });
});

//---------------------------------------------------//




app.get('/', function(req, res, next) {
    Product.find(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });


//------------------------------------------


app.get('/list', function(req, res, next) {
    Product.find(function (err, result) {
      if (err) return next(err);
       ejs.renderFile('./view/ProductList.ejs', {result: result}, (err, html) => {
            res.end(html);
        });
    });
  });







};
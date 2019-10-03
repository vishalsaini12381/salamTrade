var product = require('../../../../model/vendorModel/model/productSchema');
var product2 = require('../../../../model/vendorModel/model/productSchema');
var cart = require('../../../../model/userModel/model/cartModel');
var wishlist = require('../../../../model/userModel/model/wishlistModel');

var fetchHomeProduct = ((req,res)=>{
    try{
        product.find().limit(10).sort( { createdAt: -1 } )
        .populate('businesscategoryId','businesscategory')
        .then((product)=>{

             console.log('ZZZZZZZZZZZZZZ',product);
            if(product){
                return res.json({status: true, message: '', product});
            }else{
                return res.json({status: false, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

var fetchProduct = ((req,res)=>{
    try{
        product.find({subCategoryId:req.body.subcategoryid})
        .populate('businesscategoryId','businesscategory')
        .then((product)=>{

             console.log('ZZZZZZZZZZZZZZ',product);
            if(product){
                return res.json({status: true, message: '', product});
            }else{
                return res.json({status: false, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var productDetail = (async(req,res)=>{
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        product.findOne({_id:req.body.productId})
        .populate('businesscategoryId','businesscategory')
        .populate('categoryId','category')
        .populate('subCategoryId','subcategory')
        .then(async(product)=>{
            var obj={}
            var isCart="0"
            
            await waitFor(50);
            cart.findOne({productId:product._id,userId:req.body.userId}).
            then(async(cartData)=>{
                if(cartData){
                    isCart=cartData.quantity
                }else{
                    isCart=0
                }
            
            })
            wishlist.findOne({productId:product._id,userId:req.body.userId}).
            then(async(wishlistData)=>{
                if(wishlistData){
                    isWishlist=1
                }else{
                    isWishlist=0
                }
            
            })
            await waitFor(50);
            obj={
                "product":product,
                "isCart":isCart,
                "isWishlist":isWishlist
            }
            productData.push(obj);
            //product['gffgfggf']="sddsdsdsds";
            
           // await waitFor(100);
            console.log('ZZZZZZZZZZZZZZ',productData);
            var similarProduct=[];
            if(productData){
                product2.find({subCategoryId:productData[0].product.subCategoryId}).
                    then(async(similarProductData)=>{
                        if(similarProductData){
                            similarProduct=similarProductData
                        }
            })
            await waitFor(50);

                return res.json({status: true, message: '', productData,similarProduct});
            }else{
                return res.json({status: false, message: "Not Found",similarProduct})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var searchBox = ((req,res)=>{
    // console.log('11111111111111111111111111111111111122222222222233333333',req.body)
    try{
        let query;
                query = {productName : { $regex : req.body.search, $options:'i' }}
                product.find(query).then((product)=>{
            // console.log('2222222222222222222222222222222', product)
            res.status(200).send({product});
        },(e)=>{
            res.status(404).send(e);
        })
    } catch(e){
            return false;
    }
});

var fetchProductSpecification = (req,res)=>{
    console.log('123456789',req.body);
    try{
        let query ;
        let specification = req.body.specification;
        let status = 'false' ;
        if(status === 'false' ){
            query = {status : 'false'}
            console.log('1111111',query);
        }
        else if (status === 'false' && specification !== '') {
            query = {specification : req.body.specification} ;
            console.log('3333333',query);
        }

        console.log('4444444',query);
        product.find(query).then((doc)=>{
            // console.log('DDDDDDDDDDDDDDD',doc);
            if(doc){
                return res.json({status : true , message : '', doc});
            }else{
                return res.json({status : false , message : 'Not Found' });
            }
        })
    }catch(error){
        return res.json({status : false , message : 'Something Went Wrong'});
    }
}

module.exports = {fetchHomeProduct,fetchProduct,productDetail,searchBox,fetchProductSpecification};
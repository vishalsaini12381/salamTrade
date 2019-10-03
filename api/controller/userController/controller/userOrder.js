var order = require('../../../../model/userModel/model/orderModel');
var cart = require('../../../../model/userModel/model/cartModel');
var mongoose = require('mongoose');


var codOrder = (async(req,res)=>{
    var productData=[];
    var vendorIdData=[];
    if(req.body.userId){
        if(req.body.addressId){
            if(req.body.orderType){
                
                const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
                cart.find({userId:req.body.userId})
                .then(async(product)=>{
                    if(product){
                        productData=product;
                        productData.forEach(element=>{
                            var id = element.vendorId
                            vendorIdData.push(id);
                            // cart.findByIdAndRemove(id).then((doc)=>{})
                        })
                    }
                    await waitFor(50);
                })
                await waitFor(50);
                var userOrder    = new order({
                        userId          : req.body.userId,
                        vendorId        : vendorIdData,
                        addressId       : req.body.addressId,
                        orderType       : req.body.orderType,
                        price           : req.body.price,
                        shippingCharges : req.body.shippingCharges,
                        amount          : req.body.amount,
                        status          : 1,
                        product         : productData,
                        createdAt       : new Date(),
                });
                await waitFor(50);
                console.log('userOrderuserOrder',vendorIdData);
                userOrder.save((error,saved)=>{
                    //console.log('saved',userAddress);
                    if(error){
                        return res.json({status: false, message: 'Some error found.',code : 101});
                    }else {
                        productData.forEach(element=>{
                            var id = element._id
                            cart.findByIdAndRemove(id).then((doc)=>{})
                        })
                        return res.json({
                            status: true, 
                            message: 'Order placed successfully.',
                            code : 100,
                            data: [] 
                        });
                    }
                })
            }else{
                return res.json({
                                status: true, 
                                message: 'orderType is required field.',
                                code : 99,
                                data: [] 
                            });
            }
        }else{
            return res.json({
                            status: true, 
                            message: 'addressId is required field.',
                            code : 99,
                            data: [] 
                        });
        }
    }else{
        return res.json({
                        status: true, 
                        message: 'UserId is required field.',
                        code : 99,
                        data: [] 
                    });
    }
    
})

var myOrders = (async(req,res)=>{
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        order.find({userId:req.body.userId})
        .populate('addressId')
        .populate('userId')
        .then(async(product)=>{
           if(product.length > 0){
                return res.json({status: true,code:100, message: '', product});
            }else{
                return res.json({status: false,code:101, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false,code:102, message: "Something Went Wrong"});
    }
})


module.exports = {codOrder,myOrders};
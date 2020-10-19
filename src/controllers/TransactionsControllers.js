const {db}=require('../connections')
const {uploader}=require('./../helpers/uploader')
const fs=require('fs')

module.exports={
    Addtocart:(req,res)=>{
        const {userid,productid,qty}=req.body
        let sql=`select * from transactions where status='oncart' and users_id=${db.escape(userid)}`

        db.query(sql,(err,results)=>{
            if (err){
                console.log(err)
                return res.status(500).send(err)
            }
           
            if(results.length){
                sql=`select * from transactionsdetail where product_id=${db.escape(productid)} and transactions_id=${db.escape(results[0].id)} and isdeleted=0`
                db.query(sql,(err,results1)=>{
                    if (err){  
                        return res.status(500).send(err) 
                    }
                    if(results1.length){ //kalo results1.length true maka kita hanya perlu update qty
                        let dataupdate={
                            qty:parseInt(results1[0].qty)+parseInt(qty)
                        }
                        sql=`update transactionsdetail set ? where product_id=${db.escape(results1[0].product_id)} and transactions_id=${db.escape(results1[0].transactions_id)}`
                        db.query(sql,dataupdate,(err)=>{
                            if (err){  
                                return res.status(500).send(err) 
                            }
                            sql=`select td.qty,p.namaproduct,p.banner,p.harga,p.id as idprod,t.id as idtrans 
                            from transactionsdetail td 
                            join transactions t on td.transactions_id=t.id 
                            join product p on td.product_id=p.id
                            where t.status='onCart' and t.users_id=? and td.isdeleted=0`
                            db.query(sql,[userid],(err,datacart)=>{
                                if (err){
                                    console.log(err)
                                    return res.status(500).send(err)
                                }
                                return res.send(datacart)
                            })
                        })
                    }else{
                        // klo product di cart belum ada
                        let datainsert={
                            product_id:productid,
                            transactions_id:results[0].id,
                            qty:qty
                        }
                        sql=`insert into transactionsdetail set ?`
                        db.query(sql,datainsert,(err)=>{
                            if (err){  
                                return res.status(500).send(err) 
                            }
                            sql=`select td.qty,p.namaproduct,p.banner,p.harga,p.id as idprod,t.id as idtrans 
                            from transactionsdetail td 
                            join transactions t on td.transactions_id=t.id 
                            join product p on td.product_id=p.id
                            where t.status='onCart' and t.users_id=? and td.isdeleted=0`
                            db.query(sql,[userid],(err,datacart)=>{
                                if (err){
                                    console.log(err)
                                    return res.status(500).send(err)
                                }
                                return res.send(datacart)
                            })
                        })
                    }
                })
            }else{
                //kalo cart bener-bener kosong
                let data={
                    tanggal:new Date(),
                    status:"oncart",
                    users_id:userid
                }
                console.log('ddd')
                db.beginTransaction((err)=>{
                    if (err) { 
                       console.log(err)
                       return res.status(500).send(err) 
                    }
                    sql=`insert into transactions set ?`
                    db.query(sql,data,(err,result1)=>{
                        if (err){
                            console.log(err)
                            return db.rollback(()=>{
                                res.status(500).send(err)
                            }) 
                        }
                        data={
                            product_id:productid,
                            transactions_id:result1.insertId,
                            qty:qty
                        }
                        sql=`insert into transactionsdetail set ?`
                        db.query(sql,data,(err)=>{
                            if (err){
                                return db.rollback(()=>{
                                    res.status(500).send(err)
                                }) 
                            }
                            db.commit((err)=>{
                                if (err){
                                    return db.rollback(()=>{
                                        res.status(500).send(err)
                                    }) 
                                }
                                sql=`select td.qty,p.namaproduct,p.banner,p.harga,p.id as idprod,t.id as idtrans 
                                from transactionsdetail td 
                                join transactions t on td.transactions_id=t.id 
                                join product p on td.product_id=p.id
                                where t.status='onCart' and t.users_id=? and td.isdeleted=0`
                                db.query(sql,[userid],(err,datacart)=>{
                                    if (err){
                                        console.log(err)
                                        return res.status(500).send(err)
                                    }
                                    return res.send(datacart)
                                })
                            })
                        })
                    })
                })
            }
        })
    },
    getCart:(req,res)=>{
        const {userid}=req.query
        sql=`select td.qty,p.namaproduct,p.banner,p.harga,p.id as idprod,t.id as idtrans 
        from transactionsdetail td 
        join transactions t on td.transactions_id=t.id 
        join product p on td.product_id=p.id
        where t.status='onCart' and t.users_id=? and td.isdeleted=0`
        db.query(sql,[userid],(err,datacart)=>{
            if (err){
                console.log(err)
                return res.status(500).send(err)
            }
            return res.send(datacart)
        })
    },
    onbayarCC:(req,res)=>{
        const {idtrans,nomercc}=req.body
        let sql=`update transactions set ? where id=${db.escape(idtrans)}` 
        let dataupdate={
            tanggal:new Date(),
            status:'completed',
            metode:'cc',
            buktipembayaran:nomercc
        }
        db.query(sql,dataupdate,(err)=>{
            if (err){
                console.log(err)
                return res.status(500).send(err)
            }
            return res.send('berhasil')// nggak perlu get cart lagi karena cart kalo berhasil otomatis kosong 
        })
    }
}

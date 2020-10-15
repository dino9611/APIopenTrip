const {db}=require('../connections')
const {uploader}=require('./../helpers/uploader')
const fs=require('fs')

module.exports={
    AddProduct:(req,res)=>{
        try {
            const path='/product'//ini terserah
            const upload=uploader(path,'PROD').fields([{ name: 'image'}])
            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                console.log('berhasil upload')
                console.log(req.files)
                const {image} = req.files;
                console.log(image)
                // console.log(robin)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
                console.log(req.body.data)
                const data = JSON.parse(req.body.data); 
                let datainsert={
                    namaproduct:data.namaproduct,
                    capacity:data.capacity,
                    harga:data.harga,
                    banner:imagePath,
                    deskripsi:data.deskripsi,
                    tanggalmulai:data.tanggalmulai,
                    tanggalberakhir:data.tanggalberakhir
                }
                // data.banner=imagePath
                console.log(datainsert)
                // res.send('berhasil')
                db.query('insert into product set ?',datainsert,(err)=>{
                    if (err){
                        if(imagePath){
                            fs.unlinkSync('./public'+imagePath)
                        }
                        return res.status(500).send(err)
                    }
                    let sql=`select * from product`
                    db.query(sql,(err,dataproduct)=>{
                        if (err) return res.status(500).send(err)
                        return res.status(200).send(dataproduct)
                    })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    getProduct:(req,res)=>{
        let sql=`select * from product `
        db.query(sql,(err,dataproduct)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(dataproduct)
        })
    }
}

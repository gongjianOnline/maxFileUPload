const router = require('koa-router')()
const fs = require("fs")

router.post('/upload/:fileName', async (ctx, next) => {
  const chunkFileName = ctx.params.fileName;
  const fileName = ctx.request.query;
  let params = [];
  ctx.req.on('data', async (chunk) => {
      const buffer = Buffer.from(chunk)
      console.log(buffer)
      // await fs.mkdir(`./uploads`, { recursive: true });
      await fs.writeFileSync(`./uploads/${fileName.chunkFileName}`,buffer);
  })
  // ctx.req.on('end', (chunk) => {
  //   // console.log(params)
  //     // let buffer = Buffer.concat(params);
  //     // fs.writeFileSync(`./public/uploads/111.png`,buffer);
  // })
  ctx.body = {
    code:101,
    data:{
      chunkFileName,
      fileName,
      body:ctx.request.body
    },
    message:"请求成功"
  }
})

router.get("/xxx",async (ctx,next)=>{
  ctx.body = {
    code:101,
    data:{},
    message:"请求成功"
  }
})


module.exports = router

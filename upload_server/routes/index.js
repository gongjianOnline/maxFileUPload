const router = require('koa-router')()
const fs = require("fs-extra");

router.post('/upload/:fileName', async (ctx, next) => {
  const chunkFileName = ctx.params.fileName;
  const fileName = ctx.request.query;
  let params = [];
  // 确保块文件夹存在
  await fs.ensureDir(`./uploads/${chunkFileName}`);

  ctx.req.on('data', async (chunk) => {
      const buffer = Buffer.from(chunk)
      await fs.writeFileSync(`./uploads/${chunkFileName}/${fileName.chunkFileName}`,buffer);
  })
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
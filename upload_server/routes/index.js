const router = require('koa-router')()

router.post('/upload/:fileName', async (ctx, next) => {
  const chunkFileName = ctx.params.fileName;
  const fileName = ctx.request.query;
  ctx.body = {
    code:101,
    data:{
      chunkFileName,
      fileName
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

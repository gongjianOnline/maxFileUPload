const router = require('koa-router')()
const fs = require("fs-extra");
const path = require('path');

router.post('/upload/:fileName', async (ctx, next) => {
  const chunkFileName = ctx.params.fileName;
  const fileName = ctx.request.query;
  // 确保块文件夹存在
  await fs.ensureDir(`./uploads/${chunkFileName}`);
  const result = await fileInit(ctx,chunkFileName,fileName);
  if(result.code === 101){
    ctx.body = {
      code:101,
      data:{
        chunkFileName,
        fileName,
        body:ctx.request.body
      },
      message:"请求成功"
    }
  }else{
    ctx.body = {
      code:102,
      data:{
        chunkFileName,
        fileName,
        body:ctx.request.body
      },
      message:"请求失败"
    }
  }
})

/**文件处理 */
const fileInit = (ctx,chunkFileName,fileName)=>{
  return new Promise((resolve,reject)=>{
    let bufferData = Buffer.alloc(0);
    ctx.req.on('data', async (chunk) => {
      const chunkData = Buffer.from(chunk);
      bufferData = Buffer.concat([bufferData, chunkData]);
    })
    ctx.req.on('end', async () => {
      try {
        await fs.writeFileSync(`./uploads/${chunkFileName}/${fileName.chunkFileName}`,bufferData);
        console.log("传输完成")
        resolve({code:101,message:"文件上传成功"})
      } catch (error) {
        console.log(error)
        resolve({code:102,message:"文件上传失败"})
      }
    })
  })
}

/**合并文件接口 */
router.get("/marge/:fileName",async (ctx,next)=>{
  const chunkFileName = ctx.params.fileName;
  // 上传目录路径
  const uploadsDirectory = `./uploads/${chunkFileName}`;
  // 合并后的文件路径和文件名
  const mergedFilePath = `./uploads/${chunkFileName}.mp4`;
  // 创建一个空的合并文件
  fs.ensureFileSync(mergedFilePath);
  // 读取上传目录中的所有文件
  fs.readdir(uploadsDirectory,async (err, files) => {
    const storedFiles = files.sort(compare)
    // 对每个文件进行迭代
    storedFiles.forEach((file) => {
        const filePath = path.join(uploadsDirectory, file);
        // 将当前文件的内容追加到合并文件中
        fs.appendFileSync(mergedFilePath, fs.readFileSync(filePath));
        // 删除原始文件
        fs.unlinkSync(filePath);
        console.log(`${file} 合并完成，已被删除`);
    });
    await fs.remove(uploadsDirectory)
    console.log('文件合并完成');
  });



  /**根据文件名排序 */
  function compare(a, b) {
    const numA = parseInt(a.split('-')[1]);
    const numB = parseInt(b.split('-')[1]);
    return numA - numB;
  }

  ctx.body = {
    code:101,
    data:{},
    message:"请求成功"
  }

})


module.exports = router
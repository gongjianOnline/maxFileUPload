<template>
  <div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :on-change="handleUPload"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </div>
  <img :src="imgUrl" alt="">
  <div> 
    <video :src="imgUrl" controls></video>
  </div>
  <!-- 进度 -->
  <div>总进度: {{progressAllNum}}</div>
  <div v-for="(value, key) in progressList" :key="key">
    {{ key }}: {{ value }}
  </div>

  <el-button class="ml-3" type="success">
      upload to server
  </el-button>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import {ref,reactive} from "vue"
import type { UploadInstance } from 'element-plus'
import axios from "axios"

const uploadRef = ref<UploadInstance>();
const progressList = reactive({})
const progressAllNum = ref(0)

const imgUrl = ref("")
let fileHashName = "";
const handleUPload = async (file)=>{
  console.log(file)
  /**预览 */
  imgUrl.value = URL.createObjectURL(file.raw)
  /**生成hash */
  fileHashName = await createHash(file.raw)
  console.log(fileHashName)
  const chunks = fileChunk(file.raw,fileHashName)
  console.log(chunks)
  const requestList = chunks.map((item)=>createFileUploadRequest(fileHashName,item.chunkFileName,item.chunk))
  try {
    await Promise.all(requestList);
    await axios.get(`/api/marge/${fileHashName}`)
    console.log("上传成功")
  } catch (error) {
    console.log("上传失败",error)
  }
}


/**获取 hash 值,该方法为手动获取hash值,可以是用  Spark-md5 替代*/
const createHash = async (file)=>{
  const arrayBuffer = await file.arrayBuffer()
  console.log(arrayBuffer)
  /**
   * crypto.subtle：这是浏览器提供的Web Cryptography API的一个对象，用于进行底层密码学操作，如加密、解密、哈希等。
   * 'SHA-256' 表示哈希算法的一种格式,可以将任务长度的数据映射成固定长度(32字节)
   * */
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashResult = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join("")
  return hashResult;
}


/**文件切片 */
const fileChunk = (file,fileHashName)=>{
  let chunks:any[] = [];
  let chunkSize = 1024 * 1024 * 100;
  let count = Math.ceil(file.size / chunkSize);
  for(let i=0;i<count;i++){
    let chunk = file.slice(i * chunkSize , (i + 1) * chunkSize)
    chunks.push({
      chunk,
      chunkFileName:`${fileHashName}-${i}`
    })
  }
  return chunks;
}

/**创建文件上传请求 */
const createFileUploadRequest = (fileName,chunkFileName,chunk)=>{
  return axios({
    url:`/api/upload/${fileName}`,
    method:"post",
    data:chunk,
    headers:{
      "Content-Type": "application/octet-stream"
    },
    params:{
      chunkFileName
    },
    onUploadProgress:(progressEvent:any)=>{
      const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
      progressList[chunkFileName] = percentCompleted;
      var progressAll = calculateAverage();
      progressAllNum.value = progressAll;
    }
  })
}
const calculateAverage = ()=>{
  // 获取对象的值数组
  const values = Object.values(progressList);
  // 如果对象为空，则返回 0
  if (values.length === 0) {
    return 0;
  }
  // 使用reduce方法计算总和
  const sum:any = values.reduce((acc:any, curr:any) => acc + curr, 0);
  // 返回平均值
  return sum / values.length;
}



</script>

<style scoped>



</style>
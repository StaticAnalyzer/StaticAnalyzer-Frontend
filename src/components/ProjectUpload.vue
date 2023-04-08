<template>
  <div class="upload-card-wrapper">
    <el-card class="upload-card">
      <h1 class="upload-card-title">
        上传代码包
      </h1>
      <el-upload ref="upload" class="file-upload" :http-request="handleUploadFile" :limit="1" :on-exceed="handleExceed"
        accept=".zip, .tar, .tar.gz" :auto-upload="false" :on-success="handleSuccess" :on-error="handleError">
        <template #trigger>
          <el-button class="select_file" type="primary">选择文件</el-button>
        </template>
        <el-button class="ml-3 upload_btn" type="success" @click="submitUpload">
          上传文件
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            限制上传一个文件，重新选择文件会覆盖之前的文件
          </div>
        </template>
      </el-upload>
      <el-input v-model="config" type="textarea" placeholder="请输入代码构建configuration参数, 默认为空" />
    </el-card>
  </div>
</template>

<script>
import { genFileId } from 'element-plus'
import axios from 'axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'ProjectUpload',
  data() {
    return {
      config: '',
    }
  },
  methods: {
    handleExceed(files) {
      this.$refs.upload.clearFiles()
      const file = files[0]
      file.uid = genFileId()
      this.$refs.upload.handleStart(file)
    },
    async handleUploadFile(param) {
      let id = window.localStorage.getItem('id')
      // if (!id) {
      //   throw { message: "请首先登录" }
      // }

      let formData = new FormData()
      formData.append('id', id)
      formData.append('sourceCode', param.file)
      formData.append('config', this.config)

      return axios.post('/user/' + id + '/project', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSuccess() {
      this.$router.push('/result/')
    },
    handleError(error) {
      ElNotification({
        title: '上传失败',
        message: error.message,
        type: 'error',
      })
    }
  },
}
</script>

<style>
.upload-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.upload-card {
  width: 400px;
}

.file-upload .select_file {
  margin-right: 10px;
}

.file-upload .upload_btn {
  margin-left: 10px;
}
</style>

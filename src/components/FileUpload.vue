<template>
  <div class="upload-card-wrapper">
    <el-card class="upload-card">
      <h1 class="upload-card-title">
        上传代码包
      </h1>
      <el-upload
        ref="upload"
        class="file-upload"
        action="api=upload"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
          上传文件
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            限制上传一个文件，重新选择文件会覆盖之前的文件
          </div>
        </template>
      </el-upload>
  </el-card>
  </div>
</template>

<script>
import { genFileId } from 'element-plus'

export default {
  methods: {
    handleExceed(files) {
      this.$refs.upload.clearFiles()
      const file = files[0]
      file.uid = genFileId()
      this.$refs.upload.handleStart(file)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
  },
}
</script>

<style>
.upload-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.upload-card {
  width: 400px;
}

.file-upload .el-button {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

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
      <el-form :model="configForm" label-position="right" label-width="auto">
        <el-form-item label="C/C++ Standard">
          <el-input v-model="configForm.std" />
        </el-form-item>
        <el-form-item label="Include Paths">    
          <div v-for="(item, index) in configForm.includeDirs" :key="index" style="display: flex;">
            <el-input v-model="configForm.includeDirs[index]" clearable placeholder="e.g. path/to/include/"></el-input>
            <el-button circle @click="addListOption(configForm.includeDirs)"><el-icon><Plus /></el-icon></el-button>
            <el-button circle @click="subListOption(configForm.includeDirs, index)" v-if="index>0"><el-icon><Minus /></el-icon></el-button>
          </div>
        </el-form-item>
        <el-form-item label="Predefined Macros">    
          <div v-for="(item, index) in configForm.defMacros" :key="index" style="display: flex;">
            <el-input v-model="configForm.defMacros[index]" clearable placeholder="e.g. NDEBUG"></el-input>
            <el-button circle @click="addListOption(configForm.defMacros)"><el-icon><Plus /></el-icon></el-button>
            <el-button circle @click="subListOption(configForm.defMacros, index)" v-if="index>0"><el-icon><Minus /></el-icon></el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { genFileId } from 'element-plus'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import {Plus, Minus} from '@element-plus/icons-vue'


export default {
  name: 'ProjectUpload',
  components: {
    Plus,
    Minus
  },
  data() {
    return {
      configForm: {
        std: "c++11",
        includeDirs: [""],
        defMacros: [""]
      }
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
      
      let config = this.configForm
      config.includeDirs = config.includeDirs.filter(item => item !== "")
      config.defMacros = config.defMacros.filter(item => item !== "")

      let formData = new FormData()
      formData.append('id', id)
      formData.append('sourceCode', param.file)
      formData.append('config', JSON.stringify(config))

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
    },
    addListOption(list) {
      list.push("")
    },
    subListOption(list, index) {
      list.splice(index, 1)
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
  width: 500px;
}

.file-upload .select_file {
  margin-right: 10px;
}

.file-upload .upload_btn {
  margin-left: 10px;
}

.el-form-item {
  margin-right: 0 !important;
}
</style>

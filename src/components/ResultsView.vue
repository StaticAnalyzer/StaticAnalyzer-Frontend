<template>
  <div class="result-view-wrapper">
    <el-table :data="analysis_results" @row-click="onRowClick">
      <el-table-column prop="name" label="压缩包名称" />
      <el-table-column prop="status" label="分析状态" />
      <el-table-column prop="config" label="配置参数" />
      <el-table-column prop="time" label="上传时间" />
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'ResultsView',
  data() {
    return {
      analysis_results: []
    }
  },
  mounted() {
    let id = window.localStorage.getItem('id')
    if (!id) {
      ElNotification({
        title: '获取结果失败',
        message: '请首先登录',
        type: 'error',
      })
      return
    }

    axios.get('/user/' + id + '/project')
      .then((response) => {
        this.analysis_results = response.data
      })
      .catch((error) => {
        ElNotification({
          title: '获取结果失败',
          message: error.message,
          type: 'error'
        })
      })
  },
  methods: {
    onRowClick(row) {
      this.$router.push('/result/' + row.id)
    }
  }
}
</script>

<style>
.result-view-wrapper {
  padding: 20px;
}
</style>

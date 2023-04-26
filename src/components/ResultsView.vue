<template>
  <div class="result-view-wrapper">
    <el-table :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
      :data="analysis_results" @row-click="onRowClick">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
            :data="props.row.analyseBrief" :border="true">
            <el-table-column prop="analyseType" label="分析类型" />
            <el-table-column prop="status" label="分析结果状态">
              <template #default="scope">
                <div v-if="scope.row.status === 'Pass'">
                  <el-tag class="ml-2" type="success">Pass</el-tag>
                </div>
                <div v-else-if="scope.row.status === 'AnalyseError'">
                  <el-tag class="ml-2" type="danger">AnalyseError</el-tag>
                </div>
                <div v-else-if="scope.row.status === 'Hint'">
                  <el-tag class="ml-2" type="">Hint</el-tag>
                </div>
                <div v-else-if="scope.row.status === 'Info'">
                  <el-tag class="ml-2" type="info">Info</el-tag>
                </div>
                <div v-else-if="scope.row.status === 'Warning'">
                  <el-tag class="ml-2" type="warning">Warning</el-tag>
                </div>
                <div v-else-if="scope.row.status === 'Error'">
                  <el-tag class="ml-2" type="danger">Error</el-tag>
                </div>
              </template>
            </el-table-column>  
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="#" />
      <el-table-column prop="timestamp" label="上传时间" />
      <el-table-column prop="status" label="分析状态">
        <template #default="scope">
          <div v-if="scope.row.status === 'Complete'">
            <el-tag class="ml-2" type="success">Complete</el-tag>
          </div>
          <div v-else-if="scope.row.status === 'Queueing'">
            <el-tag class="ml-2">Queueing</el-tag>
          </div>
          <div v-else-if="scope.row.status === 'Error'">
            <el-tag class="ml-2" type="danger">Error</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="config" label="配置参数" />
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
        console.log(response.data)
        this.analysis_results = response.data.data
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

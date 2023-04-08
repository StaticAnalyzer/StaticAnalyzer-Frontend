<template>
  <div class="detials-wrapper">
    {{ details }}
  </div>
</template>

<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'DetailsView',
  data() {
    return {
      details: null
    }
  },
  mounted() {
    let id = window.localStorage.getItem('id')
    if (!id) {
      ElNotification({
        title: '获取列表失败',
        message: '请首先登录',
        type: 'error',
      })
      return
    }
    let project_id = this.$route.params.id

    axios.get('/user/' + id + '/project/' + project_id)
      .then((response) => {
        this.details = response.data
      })
      .catch((error) => {
        ElNotification({
          title: '获取结果失败',
          message: error.message,
          type: 'error'
        })
      })
  }
}
</script>

<style>
.detials-wrapper {
  padding: 20px;
}
</style>

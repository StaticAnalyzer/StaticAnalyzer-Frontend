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
    axios.get('detials', {
      params: {
        id: this.$route.params.id
      },
      headers: {
        'token': window.localStorage.getItem('token'),
      }
    }).then((response) => {
      this.details = response.data
    }).catch((error) => {
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

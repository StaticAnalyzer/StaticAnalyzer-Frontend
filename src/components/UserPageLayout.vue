<template>
  <div class="user-auth-container">
    <el-card class="user-auth-card">
      <h1 v-if="mode === 'register'">用户注册</h1>
      <h1 v-if="mode === 'login'">用户登陆</h1>
      <h1 v-if="mode === 'update'">修改用户信息</h1>
      <el-form :model="form" :rules="rules" label-position="left" label-width="100px" class="user-auth-form"
        ref="formRef">
        <el-form-item v-if="mode == 'update'" label="ID" prop="id">
          <el-input v-model="form.id" placeholder="userid" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item v-if="mode === 'register'" label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="form.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">{{ mode === 'update' ? '更新' : (mode === 'login' ? '登录' :
            '注册') }}</el-button>
          <el-button @click="handleResetForm">{{ mode=='update' ? '获取' : '重置' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
  
<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'

export default {
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ['login', 'register', 'update'].includes(value)
      }
    }
  },
  data() {
    return {
      form: {
        id: -1,
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    notificate(title, message, type) {
      ElNotification({
        title: title,
        message: message,
        type: type
      })
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.mode == 'register') {
            axios.post("/user", {
              username: this.form.username,
              password: this.form.password
            }).then(response => {
              if (response.data.code == 0)
                this.notificate("注册成功", "注册成功", "success")
              else
                this.notificate("注册失败", response.data.msg, "error")
            }).catch(error => {
              this.notificate("注册失败", error, "error")
            })
          }
          else if (this.mode == 'login') {
            axios.post("/login", {
              username: this.form.username,
              password: this.form.password
            }).then(response => {
              if (response.data.code == 0) {
                let msg = "您的id为："+response.data.data.user.id+"您的令牌为：" + response.data.data.token
                this.notificate("登陆成功", msg, "success")
                window.localStorage.setItem('id', response.data.data.user.id)
                window.localStorage.setItem("token", response.data.data.token)
                this.$router.push('/upload/')
              }
              else
                this.notificate("登陆失败", response.data.msg, "error")
            }).catch(error => {
              this.notificate("登陆失败", error, "error")
            })
          } else if (this.mode == 'update') {
            axios({
              url: '/user/'+this.form.id,
              method: 'put',
              data: {
                id: this.form.id,
                username: this.form.username,
                password: this.form.password
              },
              params: {
              }
            }).then(response => {
              if (response.data.code == 0)
                this.notificate("修改成功", "修改成功", "success")
              else
                this.notificate("修改失败", response.data.msg, "error")
            }).catch(error => {
              this.notificate("修改失败", error, "error")
            })
          }
        }
      })
    },
    handleResetForm() {
      this.$refs.formRef.resetFields()
      if(this.mode == 'update')
      {
        axios.get('/user/'+localStorage.getItem("id"), {
          params: {
          },
        }).then((response) => {
          console.log(response)
          if(response.data.code == 0)
          {
            this.form.id = response.data.data.id
            this.form.username = response.data.data.username
            this.notificate("获取成功", "获取成功", "success")
          }
          else
            this.notificate("获取失败", response.data.msg, "error")
        }).catch((error) => {
          this.notificate("获取失败", error, "error")
        })
      }
    }
  }
}
</script>
  
<style>
.user-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.user-auth-card {
  width: 400px;
}

.user-auth-form {
  margin-top: 20px;
}
</style>
  
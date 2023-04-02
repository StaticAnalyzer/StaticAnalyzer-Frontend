<template>
  <el-container>
    <el-aside class="menu-container">
      <el-menu :router="true">
        <el-sub-menu index="user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户</span>
          </template>
          <el-menu-item index="/user/info">
            <template #title>用户信息</template>
          </el-menu-item>
          <el-menu-item index="/user/login">
            <template #title>登陆</template>
          </el-menu-item>
          <el-menu-item index="/user/register">
            <template #title>注册</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/upload">
          <template #title>
            <el-icon><FolderAdd /></el-icon>
            <span>上传代码包</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/result">
          <template #title>
            <el-icon><Memo /></el-icon>
            <span>查看分析结果</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {User, FolderAdd, Memo} from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    User, FolderAdd, Memo
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.el-container {
  height: 100%;
}

.el-aside {
  width: 200px
}

.el-menu {
  height: 100%;
}

.el-main {
  padding: 0;
}
</style>

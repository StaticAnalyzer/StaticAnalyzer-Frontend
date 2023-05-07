<template>
  <el-container>
    <el-header class="menu-container" >
      <el-menu :router="true" mode="horizontal" :ellipsis="false">
        <el-menu-item index="/about">Static Analizer</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="/playground">
          <template #title>
            <el-icon><EditPen /></el-icon>
            <span>即时测试</span>
          </template>
        </el-menu-item>
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
      </el-menu>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {User, FolderAdd, Memo, EditPen} from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    User, FolderAdd, Memo, EditPen
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}

.el-container {
  height: 100%;
}

.flex-grow {
  flex-grow: 1;
}

</style>
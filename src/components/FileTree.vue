<template>
  <el-tree :data="dataSource" @node-click="handleNodeClick" >
    <template #default="{ node, data }">
      <el-icon v-if="data.children"><Folder /></el-icon>
      <el-icon v-else><Document /></el-icon>
      <el-text :type="data.textType">{{ node.label }}</el-text>
    </template>
  </el-tree>
</template>

<script>
import { Document, Folder } from '@element-plus/icons-vue';


export default {
  name: 'FileTree',
    props: {
      dataSource: {
        /*
        {
          label: "filename or dirname",
          children: [], // if directory,
          textType: "" // "" or "info" or "warning" or "danger"
          baseDir: "" // if file, the base directory of the file, shouldn't start or end with "/"
        }
        */
        type: Array,
        default: () => []
      }
    },
  components: {
    Document, Folder
  },
  methods: {
    handleNodeClick(data) {
      if (data.children) {
        return
      }
      let filePath = ""
      if (data.baseDir == "")
        filePath = data.label
      else
        filePath = data.baseDir + "/" + data.label
      this.$emit('file-click', filePath)
    }
  }
}


</script>
<template>
  <el-container>
    <el-aside>
      <FileTree :dataSource="fileTree" @file-click="handleFileClick" />
    </el-aside>
    <el-container>
      <el-main>
      <CodeView ref="editor" />
      </el-main>
      <el-footer height="20%">
        <el-table :data="problemData" height="100%" @row-click="handleProblemClick">
          <el-table-column prop="file" label="文件" min-width="20" sortable />
          <el-table-column prop="line" label="行" min-width="10" />
          <el-table-column prop="severity" label="严重性" min-width="10" sortable />
          <el-table-column prop="message" label="描述" min-width="65" />
        </el-table>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'
import FileTree from './FileTree.vue'
import CodeView from './CodeView.vue'

export default {
  name: "DetailsView",
  data() {
    return {
      fileTree: [],
      problemData: []
    };
  },
  mounted() {
    let id = this.getId();
    let project_id = this.$route.params.id;
    axios.get("/user/" + id + "/project/" + project_id)
      .then((response) => {
        let fileTreeRaw = response.data.data
        let newFileTree = []

        for (let key in fileTreeRaw["directories"])
          newFileTree.push(this.processSubDirectory(fileTreeRaw["directories"][key]))
        
        for (let key in fileTreeRaw["files"])
          newFileTree.push({
            "label": fileTreeRaw["files"][key]["name"],
            "textType": this.serverityToTextType(fileTreeRaw["files"][key]["severity"]),
            "baseDir": ""
          })

        this.fileTree = newFileTree

      })
      .catch((error) => {
        ElNotification({
          title: "获取结果失败",
          message: error.message,
          type: "error"
        });
      });

      axios.get("/user/" + id + "/project/" + project_id + "/problem")
      .then((response) => {
        this.problemData = response.data.data
      })
      .catch((error) => {
        ElNotification({
          title: "获取结果失败",
          message: error.message,
          type: "error"
        });
      });
  },
  components: { FileTree, CodeView },
  methods: {
    getId() {
      let id = window.localStorage.getItem("id");
      if (!id) {
        ElNotification({
          title: "获取列表失败",
          message: "请首先登录",
          type: "error",
        });
        return;
      }
      return id;
    },
    handleFileClick(filePath) {
      let id = this.getId();
      let project_id = this.$route.params.id;
      axios.get(`/user/${id}/project/${project_id}/file`, {
          params: {
            path: filePath
          }
        })
        .then((response) => {
          this.$refs.editor.setContent(response.data.data.src, response.data.data.analyseResults)
        })
        .catch((error) => {
          ElNotification({
            title: "获取结果失败",
            message: error.message,
            type: "error"
          });
        });
    },
    handleProblemClick(row) {
      this.handleFileClick(row.file)
    },
    serverityToTextType(severity) {
      switch (severity) {
        case "Pass":
          return ""
        case "Hint":
        case "Info":
          return "info"
        case "Warning":
          return "warning"
        case "Error":
          return "danger"
        default:
          return ""
      }
    },
    processSubDirectory(data, baseDir = "") {
      let result = {}

      result["label"] = data["name"]
      result["children"] = []

      let newBaseDir = ""
      if (baseDir === "") {
        newBaseDir = data["name"]
      } else {
        newBaseDir = baseDir + "/" + data["name"]
      }
      
      for (let key in data["directories"])
        result["children"].push(this.processSubDirectory(data["directories"][key], newBaseDir))

      for (let key in data["files"])
        result["children"].push({
          "label": data["files"][key]["name"],
          "textType": this.serverityToTextType(data["files"][key]["severity"]),
          "baseDir": newBaseDir
        })

      return result
    }
  }
}
</script>

<style>

</style>

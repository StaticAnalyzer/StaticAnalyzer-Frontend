<template>
  <el-container>
    <el-aside>
      <FileTree :dataSource="fileTree" @file-click="handleFileClick" />
    </el-aside>
    <el-main>
      <CodeView ref="editor" />
    </el-main>
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
      fileTree: []
    };
  },
  mounted() {
    let id = this.getId();
    let project_id = this.$route.params.id;
    axios.get("/user/" + id + "/project/" + project_id)
      .then((response) => {
        let fileTreeRaw = response.data.data
        let newFileTree = []

        fileTreeRaw["directories"].forEach(
          element => newFileTree.push(this.processSubDirectory(element))
        )
        
        fileTreeRaw["files"].forEach(element => {
          newFileTree.push({
            "label": element["name"],
            "textType": this.serverityToTextType(element["severity"]),
            "baseDir": ""
          })
        });

        this.fileTree = newFileTree

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
      axios.get(`/user/${id}/project/${project_id}/${filePath}`)
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
      data["directories"].forEach(
        element => result["children"].push(this.processSubDirectory(element, newBaseDir))
      )

      data["files"].forEach(element => {
        result["children"].push({
          "label": element["name"],
          "textType": this.serverityToTextType(element["severity"]),
          "baseDir": newBaseDir
        })
      });

      return result
    }
  }
}
</script>

<style>
.detials-wrapper {
  padding: 20px;
}
</style>

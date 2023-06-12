<template>
  <el-container>
    <el-aside>
      <FileTree :dataSource="fileTree" @file-click="handleFileClick" />
    </el-aside>
    <el-container>
      <el-main>
      <CodeView ref="editor" />
      </el-main>
        <el-button type="primary" @click="showProblemDrawer = true">Problems</el-button>
      <el-footer height="10%">
      </el-footer>
    </el-container>
  </el-container>
  <el-drawer 
    v-model="showProblemDrawer"
    title="Problem List"
    :with-header="false"
    size="80%"
    direction="btt"
    >
    <el-table :data="problemData" height="100%" @row-click="handleProblemClick">
      <el-table-column prop="file" label="文件" min-width="20" sortable />
      <el-table-column prop="startLine" label="行" min-width="7" />
      <el-table-column prop="severity" label="严重性" min-width="7" sortable />
      <el-table-column prop="type" label="分析类别" min-width="21" sortable :filters="problemTypes" :filter-method="problemFilterHandler" />  
      <el-table-column prop="message" label="描述" min-width="50" />
    </el-table>
  </el-drawer>
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

      problemData: [],
      problemTypes: [],

      showProblemDrawer: false,
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
        this.problemTypes = this.problemData
                            .map((item) => {return {"text": item.type, "value": item.type}})
                            .filter((item, index, self) => self.findIndex((t) => {return t.text === item.text}) === index)
      })
      .catch((error) => {
        ElNotification({
          title: "获取问题汇总失败",
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
    async getFileDetail(filePath) {
      let id = this.getId();
      let project_id = this.$route.params.id;
      return axios.get(`/user/${id}/project/${project_id}/file`, {
        params: {
          path: filePath
        }
      })
      .catch((error) => {
        ElNotification({
          title: "获取结果失败",
          message: error.message,
          type: "error"
        });
      });
      
    },
    handleFileClick(filePath) {
      this.getFileDetail(filePath).then((response) => {
        this.$refs.editor.setContent(response.data.data.src, response.data.data.analyseResults)
      })
    },
    handleProblemClick(row) {
      this.getFileDetail(row.file)
      .then((response) => {
        this.$refs.editor.setContent(response.data.data.src, response.data.data.analyseResults)
        this.$refs.editor.moveCursor(row.startLine, row.startColumn)
        this.showProblemDrawer = false
      })
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
    },
    problemFilterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
}
</script>

<style>

</style>

<template>
    <el-container>
        <el-aside>
            <el-button class="ml-3 upload_btn" type="success" @click="submitTest">
                测试
            </el-button>
            <el-input v-model="config" type="textarea" autosize placeholder="请输入代码构建configuration参数, 默认为空" />
        </el-aside>
        <el-main>
            <CodeView ref="editor" />
        </el-main>
    </el-container>
</template>
  
<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'
import CodeView from './CodeView.vue'

export default {
    name: "DetailsView",
    data() {
        return {
            config: `Framework
  {
          queue_size = 100
  }
  
  PrintLog
  {
          level = 0
          taintChecker = false
          TemplateChecker = false
          arrayBound = false
          recursiveCall = false
          divideChecker = false
          memoryOPChecker = false
  }
  `
        };
    },
    mounted() {
    },
    components: { CodeView },
    methods: {
        submitTest() {
            let code = this.$refs.editor.getCode()
            axios.post("/playground/test", {
                code: code,
                config: this.config
            }).then((response) => {
                this.$refs.editor.setContent(response.data.data.src, response.data.data.analyseResults)
            }).catch((error) => {
                ElNotification({
                    title: "获取结果失败",
                    message: error.message,
                    type: "error"
                });
            });
        }
    }
}
</script>
  
<style>
.detials-wrapper {
    padding: 20px;
}
</style>
  
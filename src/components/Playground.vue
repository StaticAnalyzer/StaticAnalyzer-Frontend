<template>
    <el-container>
        <el-aside>
            <el-button class="ml-3 upload_btn" type="success" @click="submitTest">
                测试
            </el-button>
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
            config: ""
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
  
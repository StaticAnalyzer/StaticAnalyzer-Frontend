<template>
  <div class="editor-container" id="codeEditBox"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { shallowRef } from 'vue';

export default {
  name: 'CodeView',
  data() {
    return {
      editor: null,
      code: "",
      analyseResults: [],
    }
  },
  mounted() {
    let editor = monaco.editor.create(document.getElementById('codeEditBox'), {
      language: 'cpp',
      theme: 'vs-dark',
      readOnly: false,   // 设置只读后只有Hint信息能显示
    });
    this.editor = shallowRef(editor)  // 不追踪内部变化，避免卡死
  },
  beforeUnmount() {
    this.editor.dispose()
  },
  methods: {
    setContent(code, analyseResults) {
      /*
      analyseResult=[
        {
          startLine: 1,
          startColumn: 1,     // line，column下标从1开始
          endLine: 1,
          endColumn: 2,       // 不包含endColumn
          severity: 'Error',  // Hint, Info, Warning, Error
          message: 'error message'
        }
      ]
      */
      this.code = code
      this.analyseResults = analyseResults
      this.editor.setValue(code)

      // 创建 Marker
      let markers = analyseResults.map((analyseResult) => ({
        startLineNumber: analyseResult.startLine,
        startColumn: analyseResult.startColumn,
        endLineNumber: analyseResult.endLine,
        endColumn: analyseResult.endColumn,
        severity: Reflect.get(monaco.MarkerSeverity, analyseResult.severity),
        message: analyseResult.message,
      }));

      // 显示 Marker
      monaco.editor.setModelMarkers(this.editor.getModel(), 'cpp', markers);
    }
  }
}
</script>

<style>
.editor-container {
  height: 100%;
  width: 100%;
}
</style>
<!--
	作者：ganshengqu
	时间：2020-05-27
	描述：富文本编辑器（tinymce-vue）组件
-->
<template>
  <div class="tinymce-editor">
    <TinymceVue
      api-key="no-api-key"
      :init="initModel"
      v-model="content"
      :initial-value="parentContent"
      :disabled="disabled"
    />
  </div>
</template>

<style lang="scss">
.tox-silver-sink {
  z-index: 3000 !important;
}
.tox-notification--warning {
  display: none !important;
}
.tinymce-editor {
  width: 100%;
}
#tinymce img {
  width: 100px;
  height: auto;
}
</style>

<script>
import TinymceVue from '@tinymce/tinymce-vue'
export default {
  components: { TinymceVue },
  props: {
    clearContent: {
      type: Boolean,
      default: false
    },
    parentContent: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: this.parentContent,
      initModel: {
        selector: 'textarea#format-painter',
        plugins:
          'print preview formatpainter code powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help  permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
        menubar: 'file edit view insert format tools table tc help',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | formatpainter code',
        height: 400
      }
    }
  },
  computed: {},
  watch: {
    content(newValue) {
      this.$emit('getContent', newValue)
    },
    //清空content
    clearContent(newValue) {
      if (newValue) {
        this.content = ''
      }
    },
    //回显父组件传的数据
    parentContent(newValue) {
      console.log(newValue)
      if (newValue) {
        this.content = newValue
      } else {
        this.content = ''
      }
    }
  },
  methods: {
    //去组建传递事件，清空content
    clearNoticeContent() {
      this.content = ''
    }
  }
}
</script>

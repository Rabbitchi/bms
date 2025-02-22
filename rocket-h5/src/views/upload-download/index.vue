<template>
    <div class="upload-download">
      <!-- <input type="file" @change="onFileChange" class="selectfile" />
      <div class="group">
        <el-button type="primary"  @click="uploadFile" class="uploadfile" round>上传文件</el-button>
        <el-button type="success" @click="downloadFile" class="downloadfile" round>下载文件</el-button>
      </div> -->
      <upload-excel
        :limit="5"
        :sheetName="'Sheet1'"
        :requiredColumns="'col1,col2'"
        :mainBtnText="'Upload Excel'"
        :maxSize="50"
        :needConfirm="true"
        :confirmText="'Confirm Upload'"
        :confirmTitle="'Upload Confirmation'"
        @batchImportPre="handleBatchImportPre"
        @batchImport="handleBatchImport"
      ></upload-excel>
      <el-button type="success" @click="downloadFile()" class="downloadfile">Downloads</el-button>
    </div>
</template>
  
<script>
import {downloadBMDTemplate, uploadBMDFile} from "../../api/bas/user";

import UploadExcel from '@/components/Upload/UploadExcel.vue';
export default {
  name: "UploadDownload",
  components: {
    UploadExcel,
  },
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    handleBatchImportPre(file) {
      // 处理上传前的操作
    },
    async handleBatchImport(file) {
      try {
        // 使用FormData来包装文件和其它数据
        const formData = new FormData();
        formData.append('file', file);

        // 调用后端的API进行文件上传
      const res = await uploadBMDFile(formData);
      console.log("create yingsuccessful-000",formData, res);
        // const response = await this.$http.post('/api/upload', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });

        // 处理上传后的响应
        if (response.success) {
          // 上传成功后的逻辑处理
          console.log('File uploaded successfully444:', response.data);
        } else {
          // 上传失败后的逻辑处理
          console.error('File upload failed:', response.message);
        }
      } catch (error) {
        // 处理上传过程中出现的错误
        console.error('Error during file upload:', error);
      }

    },
    
    onFileChange(event) {
      // 限制文件格式为excel 文档流
      const file= event.target.files[0];
      console.log('选择的文件:', this.selectedFile);
      if (file) {
        // 设置选中的文件
         // 检查文件扩展名
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          alert('只能上传Excel文件（.xlsx或.xls）。');
          return;
        }
        this.selectedFile = file;
        console.log('选中的文件:', file.name);
      }
    },
    uploadFile() {
      if (this.selectedFile) {
        // 提示上传成功
        console.log('准备上传文件:', this.selectedFile.name);
        this.selectedFile = null; 
      } else {
        console.log('未选择文件');
      }
    },
    downloadFile() {
      // 从服务器获取文件的方法
      console.log('准备下载文件');
      console.log('www---------------');
      // window.location.href = "http://test-app.antpesa.vip/ent-web/web/v1/downloadBMDTemplate"
      downloadBMDTemplate({ /* 必要的参数 */ })
       .then(response => {
         // 检查响应是否成功
         if (!response && response.status!== 200) {
           throw new Error('网络响应不是ok状态: ' + response.statusText);
         }
         // 返回响应的blob对象
         return response.blob();
       })
       .then(blob => {
         // 创建一个指向该blob的URL
         const url = window.URL.createObjectURL(blob);
         // 创建一个a元素用于下载
         const a = document.createElement("a");
         a.href = url;
         console.log('www-url',url);
         a.download = 'template.xlsx'; // 设置下载文件的名称
         // 模拟点击下载
         document.body.appendChild(a);
         a.click();
         // 清理并释放URL对象
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        // 输出错误信息
        console.error('There has been a problem with your fetch operation:', error);
      });

    },
   },
  };
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>

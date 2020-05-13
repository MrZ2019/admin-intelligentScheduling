// 封装React-Quill
import Actions from '../../utils/app.service'
import axios from 'axios'

import React, {Component} from 'react';
import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import './font.less'

var Delta = require('quill-delta/lib/delta');
// const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
var fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
var Font = Quill.import('formats/font');
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);

const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      // [{ 'font': fonts }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      // ['link'],
      ['clean']
    ],
    handlers: {
      "image": function () {
        let fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
              var formData = new FormData();
              formData.append("upfile", fileInput.files[0]);
              formData.append("withStatus", true);
              axios.post(Actions.uploadFileUrl, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                responseType: 'json'
              }).then(res => {
                if (res.data.errorCode == 0) {
                  let range = this.quill.getSelection(true);
                  this.quill.updateContents(new Delta()
                      .retain(range.index)
                      .delete(range.length)
                      .insert({ image: res.data.body })
                    , Quill.sources.USER);
                } else {
                  console.error(res.data);
                }
              }).catch(e => {
                console.error(e);
              });
            }
          });
          this.container.appendChild(fileInput);
        }
        fileInput.click();
      }
    }
  }
}

class QuillEditor extends Component {

  handleEditorChange = (value) => {
    const {onChange} = this.props;
    onChange(value);
  };

  render() {
    const {value} = this.props;
    return (
      <ReactQuill
        value={value}
        theme="snow"
        onChange={this.handleEditorChange}
        modules={modules}
        ref="editor"
      />
    );
  }
}

export default QuillEditor;



<template>
  <div>
    <el-button @click="visible = true">{{ $t('edit-avatar') }}</el-button>
    <el-dialog width="30%" :title="$t('edit-avatar')" :visible.sync="visible">
      <input
          ref="input"
          type="file"
          name="image"
          accept="image/*"
          style="display: none"
          @change="setImage"
      />
      <section v-show="imgSrc !== ''" class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
              ref="cropper"
              :aspect-ratio="16 / 16"
              :src="imgSrc"
              preview=".preview"
          />
        </div>
      </section>
      <span v-show="imgSrc === ''">{{ $t('avatar-prompt') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFileChooser">{{ $t('choose-img') }}</el-button>
        <el-button type="primary" @click="uploadImg">{{ $t('upload') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  name: "Avatar",
  components: {
    VueCropper,
  },
  data() {
    return {
      imgSrc: '',
      cropImg: '',
      data: null,
      visible: false
    };
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0];

      if (file.type.indexOf('image/') === -1) {
        this.$alert(this.$i18n.t('image-format-incorrect'))
        return;
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          this.$refs.cropper.replace(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser() {
      this.$refs.input.click()
    },
    uploadImg() {
      console.log('uploading')
      this.$refs.cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob(blob => {
        console.log('blob')
        const formData = new FormData()
        formData.append('avatar', blob)

        fetch('/api/user/avatar', {
          method: 'POST',
          body: formData
        })
            .then(response => {
              this.success = response.ok
              return response
            })
            .then(res => {
              if (!this.success)
                return res.json()
            })
            .then(data => {
              if (this.success) {
                this.$alert(this.$i18n.t('upload-success'))
                this.$store.commit('refresh')
              } else {
                this.$alert(this.$i18n.t(data.message))
              }
            })
            .catch(error => {
              console.log(error)
              this.$alert(this.$i18n.t('network-error'))
            })
      })
    }
  },
};
</script>

<style>

.cropper-area {
  width: 400px;
}

.cropped-image img {
  max-width: 100%;
}
</style>

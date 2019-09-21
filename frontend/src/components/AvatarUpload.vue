<template>
  <div class="avatar-upload-wrapper">
  <div class="avatar-upload mx-auto">
    <div class="avatar-edit">
      <input type='file' id="imageUpload" accept=".png, .jpg, .jpeg" @change="readFile($event)"/>
      <label for="imageUpload"></label>
    </div>
    <div class="avatar-preview">
      <div
        :style="{ 'background-image': backgroundImage }"
      >
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AvatarUpload extends Vue {
  backgroundImage: string = 'url(http://i.pravatar.cc/500?img=7)'

  readFile(event: any) {
    const input: any = event.target
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.backgroundImage = `url(${e.target.result})`
      }
      reader.readAsDataURL(input.files[0])
    }
  }
}
</script>

<style scoped lang="scss">
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

body {
  background: whitesmoke;
  font-family: 'Open Sans', sans-serif;
}

.avatar-upload-wrapper {
  max-width: 960px;
  padding: 20px;
}

h1 {
  font-size: 20px;
  text-align: center;
  margin: 20px 0 20px;
  small {
    display: block;
    font-size: 15px;
    padding-top: 8px;
    color: gray;
  }
}

.avatar-upload {
  position: relative;
  max-width: 205px;
  .avatar-edit {
    position: absolute;
    right: 12px;
    z-index: 1;
    top: 10px;
    input {
      display: none;
      + label {
        display: inline-block;
        width: 34px;
        height: 34px;
        margin-bottom: 0;
        border-radius: 100%;
        background: #FFFFFF;
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all .2s ease-in-out;
        &:hover {
          background: #f1f1f1;
          border-color: #d6d6d6;
        }
        &:after {
          content: "\f040";
          font-family: 'FontAwesome';
          color: #757575;
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          text-align: center;
          margin: auto;
        }
      }
    }
  }
  .avatar-preview {
    width: 175px;
    height: 175px;
    position: relative;
    border-radius: 100%;
    border: 6px solid #F8F8F8;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    > div {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>

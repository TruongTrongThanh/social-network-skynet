<template>
  <div class="login-form">
    <div class="switch-zone">
      <span 
        @click="isLoginSelected = true"
        :class="{ selected: isLoginSelected }"
        class="switch-btn mr-3 clickable">
        Đăng nhập
      </span>
      <span
        @click="isLoginSelected = false"
        :class="{ selected: !isLoginSelected }"
        class="switch-btn clickable"
      >
        Đăng ký
      </span>
    </div>
    <input class="mt-4 mb-2" type="text" placeholder="Your email...">
    <input class="mb-3" type="text" placeholder="Your password...">
    <button class="btn btn-success mb-5">Đăng nhập</button>
    <div class="forgot-pass clickable">
      Quên mật khẩu?
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class LoginForm extends Vue {
  isLoginSelected: boolean = true
}
</script>

<style scoped lang="scss">
  $themeColor: rgb(76, 192, 105);
  
  .login-form {
    background-color: white;
    width: 400px;
    margin: 0 auto;
    margin-top: 50px;
    color: black;
    border-radius: 10px;
    -webkit-box-shadow: 1px 7px 29px -6px rgba(0,0,0,0.7);
    -moz-box-shadow: 1px 7px 29px -6px rgba(0,0,0,0.7);
    box-shadow: 1px 7px 29px -6px rgba(0,0,0,0.7);

    input {
      background-color: #efefef;
      border-style: none;
      border-radius: 3px;
      width: 300px;
      height: 40px;
      padding: 12px;
      margin: 0 auto;
      display: block;
    }

    .btn {
      width: 180px;
    }

    .switch-btn {
      color: #c2c2c2;

      &.selected {
        color: black;
        font-weight: bold;
        padding-bottom: 5px;
        border-bottom: 3px solid $themeColor;
      }
    }

    .switch-zone {
      padding: 20px 0;
    }

    .forgot-pass {
      color: $themeColor;
      &:hover {
        color: saturate($themeColor, 20%);
      }

      background-color: #e6e6e6;
      padding: 20px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
</style>

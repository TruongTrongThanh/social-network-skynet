<template>
  <div class="entry-form">
    <div class="switch-zone">
      <span 
        @click="selectedTab = 'login'"
        :class="{ selected: selectedTab === 'login' }"
        class="switch-btn mr-3 clickable"
      >
        Đăng nhập
      </span>
      <span
        @click="selectedTab = 'register'"
        :class="{ selected: selectedTab === 'register' }"
        class="switch-btn clickable"
      >
        Đăng ký
      </span>
    </div>
    <component
      :is="selectedComp"
      :auto-fill-username.sync="autoFillUsername"
      @reigstered="switchToLogin"
    ></component>
    <div
      class="forgot-pass clickable"
      @click="selectedTab = 'forget'"
    >
      Quên mật khẩu?
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LoginFormComp from '@/components/LoginFormComp.vue'
import RegisterFormComp from '@/components/RegisterFormComp.vue'
import ForgetFormComp from '@/components/ForgetFormComp.vue'

@Component({
  components: {
    LoginFormComp,
    RegisterFormComp,
    ForgetFormComp
  }
})
export default class EntryForm extends Vue {

  selectedTab: string = 'login'
  autoFillUsername: string = ''

  get selectedComp(): string {
    return this.selectedTab + '-form-comp'
  }

  switchToLogin(username: string) {
    this.selectedTab = 'login'
    this.autoFillUsername = username
  }
}
</script>

<style lang="scss">
  .entry-form {
    background-color: white;
    width: 400px;
    margin: 0 auto;
    margin-top: 50px;
    color: black;
    border-radius: 10px;
    @include box-shadow(1px, 7px, 29px, -6px, rgba(0,0,0,0.7));

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

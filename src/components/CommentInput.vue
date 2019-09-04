<template>
  <div class="comment-input border rounded">
    <textarea class="w-100 rounded-top p-2" placeholder="What are your thoughts?"/>
    <div class="comment-control rounded-bottom clearfix">
      <button class="btn btn-primary btn-sm comment-btn px-3 mx-2 my-1 float-right">Comment</button>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CommentInput extends Vue {}
</script>

<style scoped lang="scss">
  .comment-input {

      textarea {
        border: 0;
        outline: none;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
      }

      .comment-control {
        background-color: #f8f8f8;
      }

      .comment-btn {
        font-size: .8rem;
        &:active:focus {
          -webkit-box-shadow: none;
          -moz-box-shadow: none;
          box-shadow: none;
        }
        &:focus {
          -webkit-box-shadow: none;
          -moz-box-shadow: none;
          box-shadow: none;
        }
      }
  }
</style>

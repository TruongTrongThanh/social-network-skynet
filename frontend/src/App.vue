<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  .clickable {
    cursor: pointer;
  }

  textarea {
    border: 0;
    outline: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }

  .link-unstyled {
    &,
    &:visited,
    &:hover,
    &:active,
    &:focus,
    &:active:hover {
      font-style: inherit;
      color: inherit;
      background-color: transparent;
      font-size: inherit;
      text-decoration: none;
      font-variant: inherit;
      font-weight: inherit;
      line-height: inherit;
      font-family: inherit;
      border-radius: inherit;
      border: inherit;
      outline: inherit;
      box-shadow: inherit;
      padding: inherit;
      vertical-align: inherit;
    }
  }
</style>

<script src="./Adyen.js"></script>
<i18n src="./Adyen.txt"></i18n>

<template>
<div>
  <div v-show="showComponent" ref="adyen"></div>
  <div v-show="showLoading">Loading</div>
  <div v-show="showPaid">{{$t("paid")}}</div>
  <div v-show="showError">
    {{$t("unknownError")}}
    <button @click="retry">{{$t("retry")}}</button>
  </div>
</div>
</template>

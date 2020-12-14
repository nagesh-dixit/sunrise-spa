<script src="./PageHome.js"></script>
<style src="./PageHome.scss" lang="scss"></style>

<template>
<Payment v-bind:amount="{
        currencyCode: 'AUD',
        centAmount: 8888,
      }"/>
</template>

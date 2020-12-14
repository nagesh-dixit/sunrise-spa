<script src="./Adyen.js"></script>

<template>
<div>
  <div v-show="!loading && !paid" ref="adyen"></div>
  <div v-show="loading">Loading</div>
  <div v-show="paid">Paid</div>
</div>
</template>

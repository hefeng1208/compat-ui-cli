<template>
  <el-tabs v-model="createBy" class="tab-create-by" @tab-click="changeCreateBy"><el-tab-pane :label="$t('view.vmCreate.createByCustom')" name="custom" /><el-tab-pane :label="$t('view.vmCreate.createByAg')" name="ag" /><el-tab-pane v-if="dhGray" :label="$t('view.vmCreate.createByDh')" name="dh" /></el-tabs>

</template>

<script>
export default {
  render() {
    return <el-button></el-button>;
  }

};
</script>

<style>
.app {}
</style>

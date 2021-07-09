<template>
  <jc-dialog :unvisible="hide">
    <jc-form jd="true" @change="test" v-bind='$attrs' v-on:abort="$attrs" v-slot:aa :model="{}">
      <jcFormItem>连字符</jcFormItem>
    </jc-form>
    <jcForm>
      <JcFormItem>驼峰</JcFormItem>
    </jcForm>
    <jc-button type  =  "warning">button1</jc-button>
    <jc-span>aaaaaa</jc-span>
    <jc-button type='log'>button2</jc-button>
    <span>aaaaaa</span>
    <jc-button type="success" test="aaa">button2</jc-button>
    <jc-tooltip :disabled="true" >button2</jc-tooltip>
    <span>aaaaaa</span>
    <jc-button aaa='info'>button2</jc-button>
    <jc-span>aaaaaa</jc-span>
    <jc-button type="text">button3</jc-button>
    <jc-button plain>plain-test</jc-button>
    <jc-button :plain="true">button-plain</jc-button>
    ssas
    <jc-button :circle="true">button-circle</jc-button>
    <span>aaaaaa</span>
    <jc-button :round="true">button-round</jc-button>
    <jc-component></jc-component>
    <jc-form hf="true" @change="test" v-bind:$attr v-on:abort="$attrs" v-slot:aa :model="{}"></jc-form>
  </jc-dialog>
</template>
<script>
import './src/App.vue';
/* TiDB可用区文案显示，必须传入instance，instance可自己构建假数据 */

export default {
  name: 'AzText',
  functional: true,
  props: {
    instance: {
      type: Object,
      required: true
    },

    /* 显示类型,因为实例的azId是数组，所以可以指定显示某个或全部
     * all|{index} */
    type: {
      type: String,
      required: false,
      default: 'all'
    }
  },

  render(h, context) {
    let text = '';

    if (context.props.type === 'all') {
      text = context.props.instance.azId.map(az => {
        if (!az) return;
        return context.parent.$t(`common.azMap`)[az] || '-';
      }).join(',');
    } else {
      let az = context.props.instance.azId[context.props.type];
      text = context.parent.$t(`common.azMap`)[az] || '-';
    }

    return <jc-button type="warn" jd="aaa" plain key="keyProp">{text}</jc-button>;
  }

};
</script>
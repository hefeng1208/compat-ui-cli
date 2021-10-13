<template>
  <div>
      <!-- customBlockcustomBlockcustomBlock -->
    <slot :currentVpc="currentVpc"><el-input v-model="input" placeholder="请输入内容" @click="bbb"></el-input>
<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
  <span>这是一段信息</span>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>

    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>

  </span>

</el-dialog>
<el-select v-model="currentVpc" v-loading="loading" v-select-loadmore="loadMore" :disabled="disableVpc" :placeholder="$t('choiceVPC')" class="w-5/12" value-key="vpcId"><el-option v-for="item in vpcList" :key="item.vpcId" :label="item.vpcName" :disabled="item.disabled" :value="item" /></el-select>
<el-select v-model="currentSubnet" v-loading="loading" :placeholder="$t('choiceSubNet')" class="w-5/12" value-key="subnetId"><el-option v-for="item in currentVpc.subnets || []" :key="item.subnetId" :label="item.subnetName" :disabled="item.disabled" :value="item" /></el-select>
<i class="jc-icon-my-refresh w-1/12 cursor-pointer" @click="getVpcList(true)" /></slot>

    <slot :currentSubnet="currentSubnet" name="info">
      <i18n v-show="availableIp" path="remainUsableSubNet" tag="p" class="new-tips">
        <span slot="number" class="text-warning">{{ availableIp || '--' }}</span>

      </i18n>

      <p v-show="!availableIp && !loading" class="text-danger text-primary">
        {{ $t('noUsableSubNet') }}
      </p>

      <div>
        <a :href="URLS.vpcNew" target="_blank">{{ $t('choiceVPC') }}</a>

        <a :href="URLS.subnetNew" target="_blank">{{ $t('createSubNet') }}</a>

      </div>

    </slot>

  </div>

</template>

<script>
import { reactive, toRefs, watch, computed, onMounted } from '@vue/composition-api';
import { errorHandle } from '@/utils/utility';
import common from '@/api/common';
export default {
  name: 'Vpc',
  props: {
    regionId: {
      type: String,
      default: ''
    },
    vpcId: {
      type: String,
      default: ''
    },
    vpc: {
      type: Object,
      default: () => {}
    },
    subnetId: {
      type: String,
      default: ''
    },
    subnet: {
      type: Object,
      default: () => null
    },
    disableVpc: {
      type: Boolean,
      default: false
    }
  },

  setup(props, {
    emit
  }) {
    const state = reactive({
      loading: false,
      vpcList: [],
      currentVpc: {},
      currentSubnet: {},
      pageNumber: 1,
      noMoreData: false
    });

    const getVpcList = async reset => {
      try {
        state.loading = true;
        if (reset) state.pageNumber = 1;
        let {
          vpcs,
          totalCount
        } = await common.describeVpcs({
          pageNumber: state.pageNumber,
          pageSize: 10,
          regionId: props.regionId
        });
        vpcs = vpcs || [];

        if (vpcs.length > 0) {
          state.vpcList = state.vpcList.concat(vpcs);
        }

        if (state.vpcList.length >= totalCount) state.noMoreData = true;

        if (state.pageNumber === 1 && vpcs.length > 0) {
          if (props.vpcId) {
            state.currentVpc = vpcs.find(d => d.vpcId === props.vpcId);
            if (props.subnetId) state.currentSubnet = state.currentVpc.subnets.find(d => d.subnetId === props.subnetId);
          } else {
            state.currentVpc = vpcs[0];
          }
        }
      } catch (e) {
        errorHandle(e);
      } finally {
        state.loading = false;
      }
    };

    const loadMore = async () => {
      if (state.loading || state.noMoreData) return;
      state.pageNumber += 1;
      getVpcList();
    };

    watch(() => props.vpcId, val => {
      if (val) {
        state.currentVpc = state.vpcList.find(d => d.vpcId === props.vpcId);
      }
    });
    watch(() => props.subnetId, val => {
      if (val) state.currentSubnet = state.currentVpc.subnets.find(d => d.subnetId === props.subnetId);
    });
    watch(() => state.currentVpc, val => {
      if (val && val.vpcId) {
        emit('update:vpcId', val.vpcId);
      }

      emit('update:vpc', val);
      if (val.subnets.length === 0) return;
      if (props.subnetId) state.currentSubnet = val.subnets.find(d => d.subnetId === props.subnetId);else state.currentSubnet = val.subnets[0];
    });
    watch(() => state.currentSubnet, val => {
      let subnet = null;

      if (val && val.subnetId) {
        emit('update:subnetId', val.subnetId);
        subnet = val;
      }

      emit('update:subnet', subnet);
    });
    const availableIp = computed(() => {
      if (state.currentSubnet && state.currentSubnet.availableIpCount) {
        return state.currentSubnet.availableIpCount;
      } else return null;
    });
    onMounted(() => {
      state.vpcList = [];
      getVpcList();
    });
    return { ...toRefs(state),
      getVpcList,
      availableIp,
      loadMore
    };
  }

};
</script>

<i18n locale="cn" lang="yaml">
choiceVPC:  请选择私有网络
choiceSubNet: '请选择子网络'
remainUsableSubNet: '当前子网剩余 {number} 个可用IP'
createVPC: '新建私有网络'
createSubNet: '新建子网'
noUsableSubNet: '当前可用子网数量不足，请更换其他子网或网络创建资源。'
</i18n>
<i18n locale="en" lang="yaml">
choiceVPC: 'Please select VPC'
choiceSubNet: '请选择子网络'
remainUsableSubNet: '当前子网剩余 {number} 个可用IP'
createVPC: '新建私有网络'
createSubNet: '新建子网'
noUsableSubNet: '当前可用子网数量不足，请更换其他子网或网络创建资源。'
</i18n>
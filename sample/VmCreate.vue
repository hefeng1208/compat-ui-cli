<template>
  <div class="jc-page-content">
    <div class="jc-container jc-form-create" style="overflow: hidden;">
      <i18n
        class="p-2 mb-1 text-gray-600 border border-yellow-300 bg-yellow-50 text-2"
        tag="p"
        path="view.vmCreate.instanceVoucherOnlineNow"
      >
        <i class="text-sm text-yellow-400 jc-icon-warning" />
        <span>{{ $t('view.vmCreate.instanceVourcher') }}</span>
        <a :href="serverConfig.browser.urls.instancevoucherOverview" target="_blank">{{
            $t('view.vmCreate.instanceVourcherIntro')
          }}</a>
        <a :href="serverConfig.browser.urls.instancevoucherCreate" target="_blank">{{
            $t('view.vmCreate.buyInstanceVourcher')
          }}</a>
      </i18n>
      <!--       steps步骤条 start-->
      <div v-show="createBy !== 'ag'" id="user-guide-step-2" class="mt-4">
        <jc-steps :active="active" finish-status="success" class="mt-1 jc-steps-createVm">
          <jc-step
            title="基础配置"
            :status="active === 0 ? 'process' : step1Status"
            @click.native="switchStep(0, $event)"
          />
          <jc-step
            title="网络配置"
            :status="active === 1 ? 'process' : step2Status === 'error' ? 'wait' : step2Status"
            @click.native="switchStep(1, $event)"
          />
          <jc-step
            title="系统配置(可选)"
            :status="step3Status === 'error' ? 'wait' : step3Status"
            @click.native="switchStep(2, $event)"
          />
        </jc-steps>
      </div>
      <!--       steps步骤条 end-->
      <div>
        <!--        计费，地域form start  -->
        <jc-form
          v-show="active === 0 || createBy === 'ag'"
          ref="regionForm"
          label-width="150px"
          autocomplete="off"
        >
          <div class="jc-form-section">
            <div id="cy-wrapper-region-radio" class="jc-form-section-content">
              <!--               计费类型start-->
              <jc-form-item :label="$t('create.billingType')">
                <billing-type-radio
                  v-model="localChargeMode"
                  :type="createBy === 'dh' ? 'text' : 'button'"
                >
                  <template v-slot:suffix>
                    <jc-tooltip v-if="createBy === 'dh'" effect="dark" placement="right">
                      <div slot="content">
                        指定宿主机创建时：<br />
                        仅支持创建按配置计费的实例和云硬盘，实例不再额外收费；<br />
                        仅支持创建按配置计费或按流量计费的EIP；<br />
                        如需创建包年包月的云硬盘或EIP，请单独创建再行挂载绑定。
                      </div>
                      <i class="jc-icon-my-help icon-help" />
                    </jc-tooltip>
                  </template>
                </billing-type-radio>
              </jc-form-item>
              <!--                计费类型end-->
              <!--            地域 start-->
              <jc-form-item :label="$t('create.region')">
                <region-radio
                  v-model="localRegionId"
                  :service-code="createBy === 'dh' ? 'dh' : 'vm'"
                  :show-tips="true"
                  :show-quota-tip="true"
                  :quotas="quotas.vm"
                  @change="regionChange"
                />
              </jc-form-item>
              <!--                            地域 end-->
              <!--            可用区 start-->
              <jc-form-item :label="$t('create.az')">
                <!--                   指定宿主机、资源池创建-->
                <template v-if="createBy === 'dh'">
                  <i18n
                    v-if="localLogicAzsText"
                    :path="
                        dhCreateMode === 'useHost'
                          ? 'view.vmCreate.createByDhInAzs'
                          : 'view.vmCreate.createByDpInAzs'
                      "
                  >
                    <span class="text-red-price">{{ localLogicAzsText }}</span>
                  </i18n>
                  <span v-else>{{ $t('view.vmCreate.pleaseSelectDhOrDp') }}</span>
                </template>
                <!-- 、使用高可用组创建 -->
                <template v-else-if="createBy === 'ag'">
                    <span v-if="localLogicAzsText">
                      将在高可用组指定的<span class="text-red-price">{{ localLogicAzsText }}</span
                    >内创建云主机
                    </span>
                  <span v-else>
                      请选择高可用组
                    </span>
                </template>
                <!--                    自定义创建-->
                <az-radio
                  v-else
                  v-model="localAz"
                  :region-id="localRegionId"
                  service-code="vm"
                  @change="azChange"
                />
              </jc-form-item>
              <!--            可用区 end-->
            </div>
          </div>
        </jc-form>
      </div>
    </div>
  </div>
</template>
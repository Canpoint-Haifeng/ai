<template>
  <div
    class="localtion-wrapper"
    :style="{ width: width ? width + 'px' : '100%' }"
  >
    <div class="localtion-select">
      <el-select
        v-model="selectValue.proValue"
        placeholder="请选择省"
        value-key="code"
        @change="getAreaChildOne(selectValue.proValue, 1)"
      >
        <el-option
          v-for="item in areaBox.province"
          :key="item.code"
          :value="item"
          :label="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <div class="localtion-select">
      <el-select
        v-model="selectValue.cityValue"
        :disabled="!selectValue.proValue.code"
        value-key="code"
        placeholder="请选择市"
        @change="getAreaChildOne(selectValue.cityValue, 2)"
      >
        <el-option
          v-for="item in areaBox.citys"
          :key="item.code"
          :value="item"
          :label="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <div class="localtion-select">
      <el-select
        v-model="selectValue.countyValue"
        :disabled="!selectValue.cityValue.code"
        value-key="code"
        placeholder="请选择区"
        @change="getAreaChildOne(selectValue.countyValue, 3)"
      >
        <el-option
          v-for="item in areaBox.countrys"
          :key="item.code"
          :value="item"
          :label="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <div class="localtion-select" v-if="showMech" style="width: 160px">
      <select-tree
        ref="selectTree"
        :disabled="!selectValue.countyValue.code"
        :props="props"
        :options="areaBox.organizations"
        @getValue="getValue($event)"
      ></select-tree>
      <!--<el-select v-model="selectValue.mechanismValue" :disabled="!selectValue.countyValue.code" value-key="orgId"  placeholder="请选择上级机构">-->
      <!--<el-option-->
      <!--v-for="item in areaBox.organizations"-->
      <!--:key="item.orgId"-->
      <!--:label="item.orgName"-->
      <!--:value="item">-->
      <!--</el-option>-->
      <!--</el-select>-->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'

export default {
  name: 'Localtion',
  props: {
    localtionCodeObj: {
      type: Object,
      default: () => {}
    },
    showMech: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const areaBox = ref({
      province: [],
      citys: [],
      countrys: [],
      organizations: []
    })
    
    const selectValue = ref({
      proValue: {},
      cityValue: {},
      countyValue: {},
      mechanismValue: {}
    })
    
    const props = ref({
      orgId: 'orgId',
      orgName: 'orgName',
      children: 'children'
    })
    
    const selectTree = ref(null)
    
    // 获取返回的id code
    const getValue = (data) => {
      selectValue.value.mechanismValue = data
    }
    
    // 获取省级区域
    const getAreaList = () => {
      let parms = {
        categoryId: CTS.cfgDict.CID_USER_AREA,
        level: 1
      }
      wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          areaBox.value.province = res.data
          if (props.localtionCodeObj && props.localtionCodeObj.pro) {
            chooseCity(props.localtionCodeObj).then(pss => {
              areaBox.value.citys = pss.data
              chooseQu(props.localtionCodeObj).then(scc => {
                areaBox.value.countrys = scc.data
                scc.data.forEach((value) => {
                  // 匹配区的选项
                  if (props.localtionCodeObj.con === value.code) selectValue.value.countyValue = value
                })
              })
            })
          }
        }
      })
    }
    
    // 获取机构列表
    const getOrgList = () => {
      var parms = {
        provinceId: selectValue.value.proValue.dictId,
        cityId: selectValue.value.cityValue.dictId,
        areaId: selectValue.value.countyValue.dictId
      }
      apiGet('/organizations/organizations/tree/select', parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          areaBox.value.organizations = res.data
        }
      })
    }
    
    // 选择子项获取列表时触发
    const getAreaChildOne = (value, leve) => {
      // 表头搜索
      if (leve === 1) selectValue.value.proValue = value
      if (leve === 2) selectValue.value.cityValue = value
      if (leve === 3) selectValue.value.countyValue = value
      let parms = {
        dictId: value.dictId,
        level: leve + 1
      }
      wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 表头搜索
          if (leve === 1) {
            areaBox.value.citys = res.data
            selectValue.value.cityValue = {}
            selectValue.value.countyValue = {}
          }
          if (leve === 2) {
            areaBox.value.countrys = res.data
            selectValue.value.countyValue = {}
          }
          if (leve === 3 && props.showMech) {
            getOrgList() // 获取机构列表
          }
        }
      })
    }
    
    // 获取市同步方法
    const chooseCity = (data) => {
      return new Promise((resolve) => {
        areaBox.value.province.forEach((value) => {
          if (data.pro === value.code) {
            selectValue.value.proValue = value
            let parms = {
              dictId: value.dictId,
              level: 2
            }
            wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
              if (res && res.code === CTS.constant.SUCCESS_CODE) {
                resolve(res)
              }
            })
          }
        })
      })
    }
    
    // 获取区同步方法
    const chooseQu = (data) => {
      return new Promise((resolve) => {
        areaBox.value.citys.forEach((value) => {
          if (data.cit === value.code) {
            selectValue.value.cityValue = value
            let parms = {
              dictId: value.dictId,
              level: 3
            }
            wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
              if (res && res.code === CTS.constant.SUCCESS_CODE) {
                resolve(res)
              }
            })
          }
        })
      })
    }
    
    onMounted(() => {
      getAreaList() // 获取省级区域
    })
    
    return {
      areaBox,
      selectValue,
      props,
      selectTree,
      getValue,
      getAreaList,
      getOrgList,
      getAreaChildOne,
      chooseCity,
      chooseQu
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .localtion-wrapper {
    width: 100%;
    @include flex();
    justify-content: space-between;
    .localtion-select {
      /*width: 130px;*/
      padding-right: 10px;
    }
  }
</style>

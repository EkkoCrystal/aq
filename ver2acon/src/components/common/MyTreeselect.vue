<template>
  <div>
    <treeselect
      ref="selectTree"
      v-model="valueSelf"
      :options="dataArr"
      :load-options="loadOptions"
      placeholder="请选择"
      no-options-text="暂时没有内容"
      no-children-text="暂时没有内容"
      no-results-text="没有匹配内容"
      :append-to-body="true"
      @select="changeSelect"
      @input="inputChange">
      <label slot="option-label" slot-scope="{ node }" style="color: #606266; font-size: 13px; font-weight: normal">
        {{ node.label }}
      </label>
    </treeselect>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getAreasSub } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'MyTreeselect',
  components: {
    Treeselect
  },
  props: {
    value: {
      type: String,
      default () {
        return null
      }
    },
    mydata: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dataArr: this.mydata,
      valueSelf: this.value
    }
  },
  watch: {
    mydata: {
      handler (newvalue, oldvalue) {
        this.dataArr = this.mydata
      },
      deep: true
    },
    value: {
      handler (newvalue, oldvalue) {
        this.valueSelf = this.value
      }
    }
  },
  methods: {
    changeSelect (n, i) {
      this.valueSelf = n.name
      this.$emit('changeSel', n)
    },
    inputChange (n, i) {
      this.$emit('inputChanging', n)
    },
    // 懒加载方法
    loadOptions ({ action, parentNode, callback }) {
      // 延迟加载
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.id !== null) {
          getAreasSub(parentNode.id).then(res => {
            // 处理数据this.handleCity()
            console.log(res)
            console.log('-----123----')
            const arr = []
            if (res.dataContent.length > 0) {
              res.dataContent.forEach(item => {
                const objData = {}
                objData.id = item.id
                objData.label = item.name
                objData.children = null
                arr.push(objData)
              })
            }
            console.log(arr)
            parentNode.children = arr
            callback()
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        }
      }
    }

    // normalizer (node) {
    //   if (node.children === null || node.children === 'null') {
    //     delete node.children
    //   }
    //   if (node.children && !node.children.length) {
    //     delete node.children
    //   }
    //   return {
    //     id: node.id,
    //     label: node.name,
    //     code: node.code,
    //     children: node.children
    //   }
    // }
  }
}
</script>

<style scoped>
.vue-treeselect__control {
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
}
</style>

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.setOptions(val)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions (chartData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          alwaysShowContent: true,
          triggerOn: 'click',
          formatter: '{b}<br />现有确诊{c}例',
          backgroundColor: 'rgb(0,0,0,0.7)',
          textStyle: {
            color: '#fff'
          }
        },
        visualMap: {
          type: 'piecewise',
          splitNumber: 6,
          pieces: [
            { gte: 30, label: '>=30', color: '#B60909' },
            { gte: 20, lte: 29, label: '20~29', color: '#E64546' },
            { gte: 10, lte: 19, label: '10~19', color: '#F57567' },
            { gte: 1, lte: 9, label: '1~9', color: '#FF9985' },
            { value: 0, label: '0', color: '#FFE5DB' }
          ],
          show: true
        },
        geo: {
          map: 'hangzhou',
          roam: false,
          zoom: 1.23,
          label: {
            normal: {
              show: true,
              fontSize: '14',
              color: 'rgba(0,0,0,0.7)'
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          regions: [
            {
              name: '南海诸岛',
              itemStyle: {
                normal: {
                  opacity: 0 // 为 0 时不绘制该图形
                }
              },
              label: {
                show: false // 隐藏文字
              }
            }
          ]
        },
        series: [{
          type: 'map',
          geoIndex: 0,
          data: chartData
        }]
      })
    }
  }
}
</script>

<template>
  <div :class="className" style="height:500px" class="kkloo" />
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
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null,
      barColorr: this.barColor
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
    setOptions ({ expectedData, actualData, barColor } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br/>' + '阳性' + ': {c} (人)'
        },
        grid: {
          show: false
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: actualData
        },
        series: [
          {
            name: 'day',
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              color: barColor,
              borderRadius: 5
            },
            label: {
              show: true,
              precision: 1,
              position: 'right',
              valueAnimation: true,
              fontFamily: 'monospace'
            },
            data: expectedData
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.kkloo {
  overflow: auto;
}
</style>

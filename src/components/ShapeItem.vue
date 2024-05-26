<template>
  <v-menu open-on-hover>
    <template v-slot:activator="{ props }">
      <svg :width="size" :height="size" v-bind="props">
        <path
          :d="shapePath"
          :fill="fillColor"
          @mouseenter="handleHover"
          @mouseleave="handleLeave"
        />
        <text
          :x="textX"
          y="50%"
          text-anchor="middle"
          stroke="#000000"
          stroke-width="0.25px"
          font-size="10"
          dy=".3em"
        >
          <tspan
            v-for="(word, index) in text.split(' ')"
            :key="index"
            x="50%"
            :dy="index > 0 ? '1.2em' : '0'"
          >
            {{ word }}
          </tspan>
        </text>
      </svg>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'orange'
    },
    size: {
      type: Number,
      default: 50
    },
    text: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hovered: false // replace with your own options
    }
  },
  computed: {
    shapePath() {
      if (this.type === 'circle') {
        return `M ${this.size / 2}, ${this.size / 2} m -${this.size / 2}, 0 a ${this.size / 2},${this.size / 2} 0 1,0 ${this.size},0 a ${this.size / 2},${this.size / 2} 0 1,0 -${this.size},0`
      } else if (this.type === 'square') {
        return `M 0 0 L ${this.size} 0 L ${this.size} ${this.size} L 0 ${this.size} Z`
      } else if (this.type === 'L') {
        const armLength = this.size / 2
        return `M 0 0 L ${armLength} 0 L ${armLength} ${armLength} L ${this.size} ${armLength} L ${this.size} ${this.size} L 0 ${this.size} Z`
      } else if (this.type === 'rectangle') {
        const width = this.size / 1.5
        const height = this.size
        return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`
      }
      return ''
    },
    fillColor() {
      return this.hovered ? 'blue' : this.color
    },
    textX() {
      return this.type === 'rectangle' ? '70%' : '50%'
    }
  },
  methods: {
    handleHover() {
      this.hovered = true
    },
    handleLeave() {
      this.hovered = false
    }
  }
}
</script>

<style scoped>
path {
  cursor: pointer;
}
</style>

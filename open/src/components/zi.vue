<template>
  <div class="cityList">
    <div
      :class="numIndex === i ? 'item tdSelected' : 'item'"
      v-for="(item, i) in cityList"
      :key="i"
      @click="
        tabClick(i);
        childClick(item);
      "
    >
      {{ item.features[0].properties.name }}
    </div>
  </div>
</template>
<style>
.cityList {
  width: 98%;
  text-align: center;
  border-collapse: separate;
  border-spacing: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.item {
  padding: 4px 0;
  box-sizing: border-box;
  width: 32%;
  background-color: #eeeeee;
  cursor: pointer;
  margin-bottom: 8px;
  margin-right: 2px;
}
:hover {
  background-color: rgb(28, 98, 185);
  color: white;
  cursor: pointer;
}
.tdSelected {
  background-color: rgb(28, 98, 185) !important;
  color: white;
}
</style>
<script>
import areaGeo from "../json/geojosn.json";

export default {
  data() {
    return {
      cityList: areaGeo,
      numIndex: 0,
    };
  },

  mounted() {
    this.childClick(areaGeo[0]); // 默认展示第一条数据
    this.tabClick(0);
  },
  methods: {
    childClick(item) {
      this.$emit("child-by-value", item);
    },
  },
};
</script>

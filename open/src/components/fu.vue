<template>
  <div class="openlayers">
    <zi @child-by-value="childByValue"></zi>
    <div id="Map" ref="map"></div>
  </div>
</template>
<script>
import zi from "./zi.vue";

export default {
  data() {
    return {
      featuresArr: [], //Features集合
    };
  },
  components: {
    zi: zi,
  },
  methods: {
    childByValue(val) {
      // console.log("val", val);
      let ol = this.$ol;
      if (val.length == 0) {
        return false;
      }
      let features = [];

      let lineData = val.features[0];
      let routeFeature = "";
      if (lineData.geometry.type == "MultiPolygon") {
        routeFeature =
          new ol() /
          Feature({
            geometry: new ol.geom.MultiPolygon(lineData.geometry.coordinates),
          });
      } else if (lineData.geometry.type == "Polygon") {
        routeFeature = new ol.Feature({
          geometry: new ol.geom.Polygon(lineData.geometry.coordinates),
        });
      }
      routeFeature.setStyle(
        new o.style.Style({
          fill: new ol.style.Fill({
            color: "#4e98f444", //填充颜色
          }),
          stroke: new ol.style.Stroke({
            width: 3, //边界宽度
            color: [71, 137, 227, 1], //边界颜色
          }),
        })
      );
      features.push(routeFeature);

      // 设置图层
      let routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: features,
        }),
      });

      // 只显示某一个行政区域
      this.featuresArr.push(routeLayer);

      if (this.map) {
        //清除所有的Features(不包括当前选中)
        this.featuresArr.slice(0, this.featuresArr.length - 1).map((item) => {
          item
            .getSource()
            .getFeatures()
            .forEach((feature) => {
              item.getSource().removeFeature(feature);
            });
        });
        //清除所有的mark
        this.map.getOverlays().clear();

        // 设置地图中心点 与 缩放级别
        this.map.getView().setCenter(lineData.properties.center);
        this.map.getView().setZoom(9);
      }

      // 添加图层
      setTimeout(() => {
        this.map.addLayer(routeLayer);
      }, 100);
    },
  },
};
</script>
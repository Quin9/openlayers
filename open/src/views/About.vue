<template>
  <div>
    <fu></fu>
    <div id="mm"></div>
  </div>
</template>
<script>
import fu from "../components/fu.vue";
import areaGeo from "../json/geojosn.json";
export default {
  components: { fu },
  data() {
    return {
      map: null,
      routeLayer: null,
      routeFeature: null,
      lineData: [],
    };
  },
  mounted() {
    this.initMap();
    this.addArea(areaGeo);
  },
  methods: {
    // 初始化地图
    initMap() {
      let ol = this.$ol;
      this.map = new ol.Map({
        target: "mm",
        controls: ol.control
          .defaults()
          .extend({
            zoom: true,
          })
          .extend([]),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url:
                "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            }),
          }),
        ],
        view: new ol.View({
          projection: "EPSG:4326",
          center: [118.792207, 32.133476],
          zoom: 4,
          maxZoom: 19,
          minZoom: 4,
        }),
      });
    },
    // 设置区域
    addArea(geo = []) {
      let ol = this.$ol;
      if (geo.length == 0) {
        return false;
      }
      let features = [];
      geo.forEach((g) => {
        console.log(g);

        let lineData = g.features[0];
        let routeFeature = "";
        console.log(lineData.geometry.type);
        if (lineData.geometry.type == "MultiPolygon") {
          routeFeature = new ol.Feature({
            geometry: new ol.geom.MultiPolygon(lineData.geometry.coordinates),
          });
        } else if (lineData.geometry.type == "Polygon") {
          routeFeature = new ol.Feature({
            geometry: new ol.geom.Polygon(lineData.geometry.coordinates),
          });
        }
        routeFeature.setStyle(
          new ol.style.Style({
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
      });
      // 设置图层
      let routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: features,
        }),
      });
      // 添加图层
      this.map.addLayer(routeLayer);
    },
  },
};
</script>
<style >
#mm {
  width: 90vw;
  height: 90vh;
}
</style>
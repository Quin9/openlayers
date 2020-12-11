<template>
  <div>
    <el-select v-model="se">
      <el-option value="Point">Point</el-option>
      <el-option value="LineString">LineString</el-option>
      <el-option value="Polygon">Polygon</el-option>
      <el-option value="Circle">Circle</el-option>
      <el-option value="None">None</el-option>
    </el-select>
    <el-checkbox v-model="xyz">XYZ图层</el-checkbox>
    <div id="map"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null,
      source: null,
      se: "None",
      draw: null,
      xyz: false,
      xyzMap: null,
    };
  },
  mounted() {
    this.at();
  },
  methods: {
    at() {
      let ol = this.$ol;

      //瓦片图层
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
      });

      //瓦片图层xyz数据
      this.xyzMap = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url:
            "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        }),
      });

      //矢量图层

      this.source = new ol.source.Vector({ wrapX: false });

      let vector = new ol.layer.Vector({
        source: this.source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new ol.style.Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: "#00f",
            }),
          }),
        }),
      });

      //创建鹰眼控件
      let overviewmap = new ol.control.OverviewMap({
        className: "ol-overviewmap ol-custom-overviewmap",
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM({
              url: "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
            }),
          }),
        ],
        collapseLabel: "\u00BB",
        //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
        label: "\u00AB",
        //初始为展开显示方式
        collapsed: true,
      });

      //比例尺控件
      let scaleLineControl = new ol.control.ScaleLine({
        units: "metric",
      });

      this.map = new ol.Map({
        layers: [raster, this.xyzMap],
        view: new ol.View({
          center: [0, 0],
          zoom: 4,
        }),
        target: "map",
        //添加组件                                鹰眼控件       比例尺控件
        controls: ol.control.defaults().extend([overviewmap, scaleLineControl]),
      });
      //修改图层 实现画画
      vector.setMap(this.map);
      this.map.removeLayer(this.map.getLayers().a[1]);
    },
    add() {
      let ol = this.$ol;

      let va = this.se;
      if (va !== "None") {
        this.draw = new ol.interaction.Draw({
          source: this.source,
          type: /** @type {ol.geom.GeometryType} */ (this.se),
        });
        this.map.addInteraction(this.draw);
      }
    },
  },
  watch: {
    se() {
      this.map.removeInteraction(this.draw);
      this.add();
    },
    xyz() {
      this.xyz == false
        ? this.map.removeLayer(this.map.getLayers().a[1])
        : this.map.addLayer(this.xyzMap);
    },
  },
};
</script>
<style>
#map {
  width: 90vw;
  height: 90vh;
  margin: 0 auto;
}
.ol-attribution {
  display: none;
}
.ol-zoom-in {
  position: absolute;
  top: 100px;
  left: 10px;
  width: 30px;
  height: 30px;
  border-radius: 5px;
}
.ol-zoom-in:hover {
  border-color: yellow;
}
.ol-zoom-out {
  position: absolute;
  top: 140px;
  width: 30px;
  height: 30px;
  left: 10px;

  border-radius: 5px;
}
/* 鹰眼 */
.ol-custom-overviewmap:not(.ol-collapsed) {
  border: 1px solid black;
}
.ol-custom-overviewmap .ol-overviewmap-map {
  border: none;
  width: 300px;
}

.ol-custom-overviewmap .ol-overviewmap-box {
  border: 2px solid red;
}

/* 比例尺 */
</style>
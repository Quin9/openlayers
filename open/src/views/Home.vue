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
    <el-checkbox v-model="baidu">BAIDU图层</el-checkbox>
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
      baiduMap: null,
      baidu: null,
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

      // //百度图层 dlvS5rROfU9xyCqGQWNvQBHBtdKvTAvT
      let projection = ol.proj.get("EPSG:3857");
      //分辨率
      let resolutions = [];
      for (var i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
      }
      let tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
      });
      //拼接百度地图出图地址
      let baidu_source = new ol.source.TileImage({
        //设置坐标参考系
        projection: projection,
        //设置分辨率
        tileGrid: tilegrid,
        //出图基地址
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
          if (!tileCoord) {
            return "";
          }
          var z = tileCoord[0];
          var x = tileCoord[1];
          var y = tileCoord[2];

          if (x < 0) {
            x = "M" + -x;
          }
          if (y < 0) {
            y = "M" + -y;
          }
          return (
            "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
            x +
            "&y=" +
            y +
            "&z=" +
            z +
            "&styles=pl&udt=20151021&scaler=1&p=1"
          );
        },
      });
      this.baiduMap = new ol.layer.Tile({
        source: baidu_source,
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
        layers: [raster, this.baiduMap, this.xyzMap],
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

      //初始化时移除 xyz 视图层
      this.map.removeLayer(this.xyzMap);
      this.map.removeLayer(this.baiduMap);
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
        ? this.map.removeLayer(this.xyzMap)
        : this.map.addLayer(this.xyzMap);
    },
    baidu() {
      this.baidu == false
        ? this.map.removeLayer(this.baiduMap)
        : this.map.addLayer(this.baiduMap);
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
<template>
  <div>
    <div id="mm"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.at();
  },
  methods: {
    at() {
      let ol = this.$ol;
      this.map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: "mm",
        view: new ol.View({
          center: [0, 0],
          zoom: 4
        })
      });
    }
  }
};
</script>
<style >
#mm {
  width: 90vw;
  height: 90vh;
}
</style>
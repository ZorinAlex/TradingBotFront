<script>
import { Line, mixins } from "vue-chartjs";
import zoom from "chartjs-plugin-zoom";

export default {
  name: "periodTestChart",
  extends: Line,
  mixins: [mixins.reactiveData],
  mounted() {
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.chartOptions);
  },
  data: () => ({
    chartData: getData(),
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
            speed: 2,
            threshold: 10,
          },
          zoom: {
            enabled: true,
            drag: false,
            mode: "x",
            speed: 0.2,
            threshold: 5,
            sensitivity: 1,
          },
        },
      },
    },
    labels: [],
    data: [],
    pointColor: [],
    pointStyle: [],
      pointBorderColor: []
  }),
  methods: {
    clearGraph() {
      this.labels = [];
      this.data = [];
      this.pointColor = [];
      this.pointBorderColor = [];
      this.pointStyle = [];
      let chartData = getData();
      this.chartData = Object.assign({}, this.chartData, chartData);
    },
    add(label, value, color, shape) {
      this.labels.push(label);
      this.data.push(value);
      this.pointColor.push(color);
      this.pointBorderColor.push(color);
      this.pointStyle.push(shape);
      this.chartData = Object.assign({}, this.chartData, {
        labels: this.labels,
        datasets: [
          {
            label: "",
            borderColor: "#cfcfcf",
            borderWidth: 1,
            fill: false,
            data: this.data,
            pointBackgroundColor: this.pointColor,
            pointStyle: this.pointStyle,
            pointBorderColor: this.pointBorderColor,
          },
        ],
      });
    },
  },
};

function getData() {
  return {
    labels: [],
    datasets: [
      {
        label: "",
        borderColor: "#cfcfcf",
        borderWidth: 1,
        fill: false,
        data: [],
      },
    ],
  };
}
</script>

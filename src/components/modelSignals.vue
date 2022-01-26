<template>
    <div class="mb-4">
        <model-signals-chart ref="chart" />
    </div>
</template>

<script>
    import modelSignalsChart from "./actionsChart";
    import { mapActions } from "vuex";
    export default {
        name: "modelSignals",
        components:{
            modelSignalsChart
        },
        props: {
            model: String,
            version: String,
            hours: Number
        },
        methods: {
            ...mapActions(["getHoursData", "getPrediction"]),
            getColor(action) {
                switch (action) {
                    case "SELL":
                        return { color: "#ff0b0c", shape: "triangle" };
                    case "BUY":
                        return { color: "#00ed12", shape: "rect" };
                    case "NONE":
                        return { color: "#9c9c9c", shape: "star" };
                }
            },

            formatDataInput(data, dataset){
                let label = new Date(data.data.timestamp).toLocaleString() + "_" + data.data.predictionPercentage + "%";
                let { color, shape } = this.getColor(data.data.predictionAction, data.data.predictionPercentage);
                let value = dataset[dataset.length - 1].close;
                return {label, value, color, shape}
            },

            async start() {
                this.$refs.chart.clearGraph();
                const exchangeData = await this.getHoursData(this.hours);
                for (let index = 0; index < exchangeData.length - this.hours; index++) {
                    let data = exchangeData.slice(index, index + this.hours + 1);
                    let prediction = await this.getPrediction({data, model: this.model, version: this.version});
                    let {label, value, color, shape} = this.formatDataInput(prediction, data);
                    this.$refs.chart.add(label, value, color, shape);
                }
            },
        },
    }
</script>

<style scoped>
</style>

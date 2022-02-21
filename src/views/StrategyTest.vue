<template>
    <v-container>
        <pixi-chart/>
        <v-row>
            <v-select
                    :items="getStrategiesList"
                    item-text="name"
                    item-value="value"
                    v-model="currentStrategy"
                    label="Strategy"
                    outlined
                    hide-details
            ></v-select>
        </v-row>
        <v-row v-show="currentStrategy">
            <v-col class="strategy-description">
                <v-row class="strategy-description__item">
                    <div >isActive: <span>{{currentStrategy.isActive}}</span></div>
                    <div>Sequential: <span>{{currentStrategy.sequential}}</span></div>
                </v-row>
                <v-row class="strategy-description__item">
                    <div>stopLoss: <span>{{currentStrategy.stopLoss}}</span></div>
                    <div>stopLossIsTrailing: <span>{{currentStrategy.stopLossIsTrailing}}</span></div>
                    <div>stopLoss: <span>{{currentStrategy.stopLossPercent}}%</span></div>
                </v-row>
                <v-row class="strategy-description__item">
                    <div>trailingSell: <span>{{currentStrategy.trailingSell}}</span></div>
                    <div>sellConfidence: <span>{{currentStrategy.sellConfidence}}%</span></div>
                    <div>trailingSell: <span>{{currentStrategy.trailingSellPercent}}%</span></div>
                </v-row>
                <v-row class="strategy-description__item">
                    <div>trailingBuy: <span>{{currentStrategy.trailingBuy}}</span></div>
                    <div>trailingBuy: <span>{{currentStrategy.trailingBuyPercent}}%</span></div>
                    <div>buyConfidence: <span>{{currentStrategy.buyConfidence}}%</span></div>
                    <div>buyAmount: <span>{{currentStrategy.buyAmountPercent}}%</span></div>
                </v-row>
            </v-col>
        </v-row>
        <date-time-picker name="Start" @setTime="setSTime"/>
        <date-time-picker name="End" @setTime="setETime"/>
        <v-row class="my-2 mx-4">
            <v-btn
                    tile
                    @click="startTest"
                    :disabled="!currentStrategy"
                    color="primary">
                Run test
                <v-icon right>
                    mdi-chevron-triple-right
                </v-icon>
            </v-btn>
        </v-row>
        <v-row v-if="currentStrategy" class="justify-center my-2">
            <div class="text-h5">Model signals</div>
        </v-row>
        <div v-if="currentStrategy">
            <signals-chart ref="chart"/>
        </div>
    </v-container>
</template>

<script>
    import dateTimePicker from "../components/dateTimePicker";
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import * as _ from 'lodash';
    import signalsChart from "../components/actionsChart";
    import pixiChart from "../components/pixiChart";
    export default {
        name: "StrategyTest",
        components: {
            dateTimePicker, signalsChart, pixiChart
        },
        data: ()=>({
            currentStrategy:'',
            models: [
                {name: 'BTCUSD_blockchain_hours_60', version: '1', hours: 60},
            ]
        }),
        methods: {
            ...mapMutations(['setStartTime', 'setEndTime']),
            ...mapActions(['clearData', 'getStrategies', 'getHoursData', "getPrediction", "getTestMinuteDataForHour", "getStrategyTest"]),
            setSTime(time){
                this.setStartTime(time);
            },
            setETime(time){
                this.setEndTime(time);
            },
            async startTest(){
                const model = _.find(this.models, (model)=> this.currentStrategy.model === model.name);
                const exchangeData = await this.getHoursData(model.hours);

                for (let index = 0; index < exchangeData.length - model.hours; index++) {
                    let data = exchangeData.slice(index, index + model.hours + 1);
                    //1 get prediction -> to strategy
                    let prediction = await this.getPrediction({data, model: model.name, version: model.version});
                    let testPrediction = await this.getStrategyTest({
                        modelName: model.name,
                        modelVersion: model.version,
                        price: data[data.length-1].close,
                        isFromTicker: false,
                        predictionData: prediction.data
                    });
                    this.addDataToChart(testPrediction.data, data[data.length-1].close, data[data.length-1].timestamp, prediction.data);
                    //2 get ticker -> to strategy
                    const tickerData = await this.getTestMinuteDataForHour(data[data.length-1].timestamp + 60*1000);
                    for (let tickerIndex = 0; tickerIndex < tickerData.length; tickerIndex++) {
                        let testTicker = await this.getStrategyTest({
                            modelName: model.name,
                            modelVersion: model.version,
                            price: tickerData[tickerIndex].close,
                            isFromTicker: true,
                            predictionData: null
                        });
                        this.addDataToChart(testTicker.data, tickerData[tickerIndex].close, tickerData[tickerIndex].timestamp, null);
                    }
                }
            },
            addDataToChart(actionData, price, timestamp, prediction){
                let label;
                if(!_.isNil(prediction)){
                    label = new Date(timestamp).toLocaleString() + "_" + "PREDICTION:" + prediction.predictionPercentage + "% " + "ACTION:"+actionData.action;
                }else{
                    label = new Date(timestamp).toLocaleString() + "_" + "TICKER "+ "ACTION:"+actionData.action;
                }
                let { color, shape } = this.getColor(actionData.action);
                this.$refs.chart.add(label, price, color, shape);
            },
            getColor(action) {
                switch (action) {
                    case "SELL":
                        return { color: "#ff0b0c", shape: "circle" };
                    case "TS_STEP":
                        return { color: "#7e0b0c", shape: "circle" };
                    case "BUY":
                        return { color: "#00ed12", shape: "rect" };
                    case "TB_STEP":
                        return { color: "#287e20", shape: "rect" };
                    case "SL_STEP":
                        return { color: "#00028b", shape: "triangle" };
                    case "SL":
                        return { color: "#001ff8", shape: "triangle" };
                    case "NONE":
                        return { color: "#9c9c9c", shape: "star" };
                }
            },
        },
        computed:{
            ...mapGetters([
                'strategies'
            ]),
            getStrategiesList(){
                return _.map(this.strategies, (strategy)=>{
                    return {
                        name: `${strategy.model} version:${strategy.version}`,
                        value: strategy
                    }
                })
            },
        },
        mounted() {
            this.getStrategies();
        }
    };
</script>
<style lang="scss" scoped>
    .strategy-description{
        margin: 15px 0;
        .strategy-description__item{
            div{
                width: 250px;
            }
        }
    }
</style>

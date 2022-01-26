<template>
    <v-container>
        <v-row class="strategy-head">
            <div class="text-h5">Model Name: {{this.model}}  Version: {{this.version}}</div>
        </v-row>
        <v-row class="strategy-desc">
            <v-col cols="12" md="11" class="strategy-desc-items">
                <div>Buy Confidence: {{this.buyConf}}%</div>
                <div>Sell Confidence: {{this.sellConf}}%</div>
                <div>Sequential Buy/Sell: {{this.sequential}}</div>
                <div>Buy Amount: {{this.buyAmountPercent}}%</div>
                <div v-if="this.trBuy">Trailing Buy Percent: {{this.trBuyPercent}}%</div>
                <div v-if="this.trSell">Trailing Sell Percent: {{this.trSellPercent}}%</div>
            </v-col>
            <v-col cols="12" md="1" class="strategy-desc-btn" >
                <v-btn
                        fab
                        dark
                        small
                        color="primary"
                        @click="()=>{showSettings = !showSettings}"
                >
                    <v-icon dark>
                        mdi-cog-outline
                    </v-icon>
                </v-btn>
            </v-col>

        </v-row>
        <v-container v-show="showSettings" class="mt-7">
            <v-row justify="center">
                <v-col cols="12" sm="6" md="6">
                    <v-slider
                            class="my-1"
                            label="Buy Confidence"
                            max="100"
                            min="0"
                            thumb-label="always"
                            v-model="buyConf"
                    ></v-slider>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-slider
                            class="my-1"
                            label="Sell Confidence"
                            max="100"
                            min="0"
                            thumb-label="always"
                            v-model="sellConf"
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" sm="3" md="3">
                    <v-checkbox
                            class="my-1"
                            v-model="sequential"
                            label="Sequential Buy/Sell"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="9" md="9">
                    <v-slider
                            class="my-1"
                            label="Buy Amount Percent"
                            max="100"
                            min="0"
                            thumb-label="always"
                            v-model="buyAmountPercent"
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" sm="3" md="3">
                    <v-checkbox
                            class="my-1"
                            v-model="trBuy"
                            label="Trailing Buy"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="9" md="9">
                    <v-slider
                            class="my-1"
                            label="Trailing Buy Percent"
                            max="10"
                            step="0.1"
                            min="0"
                            thumb-label="always"
                            v-model="trBuyPercent"
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" sm="3" md="3">
                    <v-checkbox
                            class="my-1"
                            v-model="trSell"
                            label="Trailing Sell"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="9" md="9">
                    <v-slider
                            class="my-1"
                            label="Trailing Sell Percent"
                            max="10"
                            step="0.1"
                            min="0"
                            thumb-label="always"
                            v-model="trSellPercent"
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3" md="3">
                    <v-checkbox
                            class="my-1"
                            v-model="stopLoss"
                            label="Stop Loss"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="9" md="9">
                    <v-slider
                            class="my-1"
                            label="SL Percent"
                            max="10"
                            step="0.1"
                            min="0"
                            thumb-label="always"
                            v-model="stopLossValue"
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3" md="3">
                    <v-checkbox
                            class="my-1"
                            v-model="isMartingale"
                            label="Martingale"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="2" md="2">
                    <v-text-field
                            label="Steps"
                            type="number"
                            v-model="mSteps"
                            @change="calcMartingale"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="2">
                    <v-text-field
                            label="Total"
                            type="number"
                            v-model="mTotal"
                            @change="calcMartingale"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="5" md="5" class="mt-6">
                    Bets: {{this.mBets}}
                </v-col>
            </v-row>
        </v-container>
        <v-row class="strategy-desc">
            <v-col cols="12" md="1" class="strategy-desc-start" >
                <v-btn
                        fab
                        dark
                        small
                        color="red"
                        @click="start()"
                >
                    <v-icon dark>
                        mdi-play-circle-outline
                    </v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" md="11" class="strategy-desc-items">
                <div>Total USD: {{this.totalBalance}}</div>
                <div>Last Sell USD: {{this.lastSell}}</div>
                <div>USD: {{this.walletUSD}}</div>
                <div>BTC: {{this.walletBTC}}</div>
                <div>Sells: {{this.getSells}}</div>
                <div>Buy: {{this.getBuy}}</div>
            </v-col>
        </v-row>
        <div>
            <strategy-signals-chart ref="chart" />
        </div>
    </v-container>
</template>

<script>
    import strategySignalsChart from "./actionsChart";
    import { mapActions } from "vuex";
    import * as _ from 'lodash';
    export default {
        components: {strategySignalsChart},
        name: "strategy",
        props: {
            model: String,
            version: String,
            initSequential: Boolean,
            initTrBuy: Boolean,
            initTrBuyPercent: Number,
            initTrSell: Boolean,
            initTrSellPercent: Number,
            initBuyAmountPercent: Number,
            initBuyConf: Number,
            initSellConf: Number
        },
        data: ()=>({
            //fees and limits
            takerFee: 0.4,
            minUSDbuyAmount: 5,
            //
            showSettings: false,
            currentState: 'NONE',
            actions: [],
            lastSell: 0,
            totalBalance: 0,
            walletUSD: 100,
            walletBTC: 0,
            sequential: false,
            trBuy: false,
            trBuyPercent: 0,
            trSell: false,
            trSellPercent: 0,
            buyAmountPercent: 50,
            buyConf: 0,
            sellConf: 0,
            //Martingale
            isMartingale: false,
            mFactors: [],
            mBets:[],
            mTotal: 100,
            mSteps: 4,
            mCurrentIndex: 0,
            //stopLoss
            stopLoss: true,
            stopLossValue: 2,
            stopLossPrice: 0
        }),
        created(){
            this.sequential = this.initSequential;
            this.trBuy = this.initTrBuy;
            this.trBuyPercent = this.initTrBuyPercent;
            this.trSell = this.initTrSell;
            this.trSellPercent = this.initTrSellPercent;
            this.buyAmountPercent = this. initBuyAmountPercent;
            this.buyConf = this.initBuyConf;
            this.sellConf = this.initSellConf;
            this.calcMartingale();
        },
        methods:{
            ...mapActions(["getMinutesData", "getPredictionsData"]),
            async start(){
                this.lastSell = 0;
                this.totalBalance = 0;
                this.mCurrentIndex = 0;
                this.currentState= 'NONE';
                this.actions = [];
                this.walletUSD= 100;
                this.walletBTC= 0;
                this.$refs.chart.clearGraph();
                const data = await this.getPredictionsData({model: this.model, version: this.version});
                for(let i = 0; i<data.length; i++){
                    await this.addData(data[i]);
                }
            },
            async addData(data){
                return new Promise(((resolve) => {
                    this.calcTotal(data.price);
                    switch (data.action) {
                        case 'NONE':
                            switch (this.currentState) {
                                case "NONE":
                                    this.addDataToChart(data.time, data.price, "NONE");
                                    resolve();
                                    break;
                                case "BUY":
                                    if(this.trBuy){
                                        this.trailingBuy(data, resolve);
                                    }else {
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                                case "BUYED":
                                    if(this.stopLoss){
                                        this.stopLossCheck(data, resolve)
                                    }else{
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                                case "SELL":
                                    if(this.trSell){
                                        this.trailingSell(data, resolve);
                                    }else{
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                            }
                            break;
                        case 'BUY':
                            switch (this.currentState) {
                                case "NONE":
                                    if(data.confidence > this.buyConf){
                                        this.buyActionInput(data, resolve);
                                    }else{
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                                case "BUY":
                                    if(this.trBuy){
                                        this.trailingBuy(data, resolve);
                                    }else{
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                                case "BUYED":
                                    if(this.sequential){
                                        if(this.stopLoss){
                                            this.stopLossCheck(data, resolve)
                                        } else {
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }else{
                                        if(data.confidence > this.buyConf){
                                            this.buyActionInput(data, resolve);
                                        }else{
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }
                                    break;
                                case "SELL":
                                    if(this.sequential){
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve();
                                    }else{
                                        if(data.confidence > this.buyConf){
                                            this.buyActionInput(data, resolve);
                                        }else{
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }
                                    break;
                            }
                            break;
                        case 'SELL':
                            switch (this.currentState) {
                                case "NONE":
                                    if(this.sequential){
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }else{
                                        if(data.confidence > this.sellConf){
                                            this.sellActionInput(data, resolve);
                                        }else{
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }
                                    break;
                                case "BUY":
                                    if(this.sequential){
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve();
                                    }else{
                                        if(data.confidence > this.sellConf){
                                            this.sellActionInput(data, resolve);
                                        }else{
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }
                                    break;
                                case "BUYED":
                                    if(data.confidence > this.sellConf){
                                        this.sellActionInput(data, resolve);
                                    }else{
                                        if(this.stopLoss){
                                            this.stopLossCheck(data, resolve)
                                        }else{
                                            this.addDataToChart(data.time, data.price, "NONE");
                                            resolve()
                                        }
                                    }
                                    break;
                                case "SELL":
                                    if(this.trSell){
                                        this.trailingSell(data, resolve);
                                    }else{
                                        this.addDataToChart(data.time, data.price, "NONE");
                                        resolve()
                                    }
                                    break;
                            }
                            break;
                    }
                }))
            },
            calcTotal(lastPrice){
                this.totalBalance = this.walletBTC * lastPrice + this.walletUSD
            },
            async stopLossCheck(data, resolve){
                const futureData = await this.getMinutesData(data.time);
                for(let i = 0; i< futureData.length-1; i++){
                    this.calcTotal(futureData[i].close);
                    let newStopLossPrice = futureData[i].close - futureData[i].close*this.stopLossValue/100;
                    if(newStopLossPrice > this.stopLossPrice){
                        this.stopLossPrice = newStopLossPrice;
                    }
                    console.log("stop loss price: ", this.stopLossPrice, "at: ", new Date(futureData[i].timestamp).toLocaleString(), 'compere with: ',futureData[i].close, 'result: ', futureData[i].close < this.stopLossPrice );
                    if(futureData[i].close < this.stopLossPrice){
                        this.sell(futureData[i].close, futureData[i].timestamp, true);
                        this.stopLossPrice = 0;
                        resolve();
                        return false;
                    }else{
                        this.addDataToChart(futureData[i].timestamp, futureData[i].close, "TR_SL");
                    }
                }
                resolve();
            },
            buyActionInput(data, resolve){
                this.currentState = 'BUY';
                if(this.trBuy){
                    this.trailingBuy(data, resolve);
                }else{
                    this.buy(data.price, data.time);
                    resolve();
                }

            },
            async trailingBuy(data, resolve){
                const futureData = await this.getMinutesData(data.time);
                let startPrice = futureData[0].close;
                console.log("trailing buy start price: ", startPrice, "at: ", new Date(data.time).toLocaleString());
                for(let i = 0; i< futureData.length-1; i++){
                    this.calcTotal(futureData[i].close);
                    let trailingBuyAdditionalValue = startPrice + startPrice*this.trBuyPercent/100;
                    console.log("trailing buy iteration: ", futureData[i].close, "at: ", new Date(futureData[i].timestamp).toLocaleString(), 'compere with: ', trailingBuyAdditionalValue, 'result: ', futureData[i].close > trailingBuyAdditionalValue);
                    if(futureData[i].close > trailingBuyAdditionalValue){
                        this.buy(futureData[i].close, futureData[i].timestamp);
                        resolve();
                        return false;
                    }else {
                        this.addDataToChart(futureData[i].timestamp, futureData[i].close, "TR_BUY");
                        startPrice = futureData[i].close
                    }
                }
                resolve();
            },
            findLastClosedOrderStatus(){
              let lastSellIndex =  _.findLastIndex(this.actions, action => action.action === 'SELL');
              if(lastSellIndex>-1){
                  let sellResultPrice = this.actions[lastSellIndex].price;
                  let maxBuyResultPrice = 0;
                  for(let i = lastSellIndex-1; i>=0; i--){
                    if(this.actions[i].action === 'BUY' && this.actions[i].price> maxBuyResultPrice){
                        maxBuyResultPrice = this.actions[i].price;
                    }
                    if(this.actions[i].action === 'SELL'){
                        return sellResultPrice>maxBuyResultPrice
                    }
                  }
                  return sellResultPrice>maxBuyResultPrice
              }
              return true
            },
            buy(price, time){
                let buyAmount;
                if (!this.isMartingale){
                    buyAmount = this.walletUSD * this.buyAmountPercent/100;
                }else{
                    if(this.findLastClosedOrderStatus()){
                        this.mCurrentIndex = 0;
                    }else{
                        this.mCurrentIndex++;
                        if(this.mCurrentIndex > this.mSteps-1){
                            this.mCurrentIndex = this.mSteps-1
                        }
                    }
                    buyAmount = this.mBets[this.mCurrentIndex]
                }
                if(buyAmount < this.minUSDbuyAmount) buyAmount = this.minUSDbuyAmount;
                if(this.walletUSD >= this.minUSDbuyAmount){
                    this.addDataToChart(time, price, "BUY");
                    const btcAmount = buyAmount/price;
                    this.walletBTC = this.walletBTC + btcAmount;
                    this.walletUSD = this.walletUSD - buyAmount;
                    this.takeFee(buyAmount);
                    this.actions.push({
                        price,
                        action: 'BUY',
                        amount: buyAmount,
                        time
                    });
                    this.currentState = 'BUYED';
                    this.stopLossPrice = price - price*this.stopLossValue/100;
                }else{
                    this.addDataToChart(time, price, "NONE");
                }
            },
            takeFee(amount){
                let fee = amount * this.takerFee/100;
                this.walletUSD = this.walletUSD - fee;
            },
            sellActionInput(data, resolve){
                this.currentState = 'SELL';
                if(this.trSell){
                    this.trailingSell(data, resolve);
                }else{
                    this.sell(data.price, data.time);
                    resolve();
                }
            },
            async trailingSell(data, resolve){
                const futureData = await this.getMinutesData(data.time);
                let startPrice = futureData[0].close;
                for(let i = 0; i< futureData.length-1; i++) {
                    this.calcTotal(futureData[i].close);
                    let trailingSellAdditionalValue = startPrice - startPrice * this.trSellPercent / 100;
                    if (futureData[i].close < trailingSellAdditionalValue) {
                        this.sell(futureData[i].close, futureData[i].timestamp);
                        resolve();
                        return false;
                    } else {
                        startPrice = futureData[i].close;
                        this.addDataToChart(futureData[i].timestamp, futureData[i].close, "TR_SELL");
                    }
                }
                resolve()
            },
            sell(price, time, isSL = false){
                if(isSL){
                    this.addDataToChart(time, price, "SL");
                }else{
                    this.addDataToChart(time, price, "SELL");
                }
                const sellAmount = this.walletBTC * price;
                this.takeFee(sellAmount);
                this.walletBTC = 0;
                this.walletUSD = this.walletUSD + sellAmount;
                this.lastSell = this.walletUSD;
                this.actions.push({
                    price,
                    action: 'SELL',
                    amount: sellAmount,
                    time,
                    isSL
                });
                this.currentState = 'NONE'
            },
            getColor(action) {
                switch (action) {
                    case "SELL":
                        return { color: "#ff0b0c", shape: "triangle" };
                    case "BUY":
                        return { color: "#00ed12", shape: "rect" };
                    case "NONE":
                        return { color: "#9c9c9c", shape: "star" };
                    case "TR_BUY":
                        return { color: "#287e20", shape: "circle" };
                    case "TR_SELL":
                        return { color: "#7e0b0c", shape: "circle" };
                    case "TR_SL":
                        return { color: "#00028b", shape: "circle" };
                    case "SL":
                        return { color: "#001ff8", shape: "triangle" };
                }
            },
            addDataToChart(timestamp, value, action){
                let label = new Date(timestamp).toLocaleString();
                let { color, shape } = this.getColor(action);
                this.$refs.chart.add(label, value, color, shape);
            },
            calcMartingale(){
                this.mFactors = [];
                this.mBets = [];
                let factor = 1;
                for(let i=0; i<this.mSteps; i++){
                    this.mFactors[i] = factor;
                    factor= factor*2;
                }
                const sum = _.reduce(this.mFactors, (s, n)=>{
                    return s + n
                }, 0);
                const stepFactor = this.mTotal/sum;
                _.forEach(this.mFactors,(factor, index)=>{
                    this.mBets[index] = Math.floor(stepFactor * factor)
                });
                let betsSum = _.reduce(this.mBets, (s, n)=>{
                    return s + n
                }, 0);
                this.mBets[this.mBets.length - 1] += (this.mTotal - betsSum);
                betsSum = _.reduce(this.mBets, (s, n)=>{
                    return s + n
                }, 0);
            }
        },
        computed:{
            getSells(){
                let counter = 0;
                _.forEach(this.actions, (action)=>{
                    if(action.action === 'SELL') counter ++
                });
                return counter
            },
            getBuy(){
                let counter = 0;
                _.forEach(this.actions, (action)=>{
                    if(action.action === 'BUY') counter ++
                });
                return counter
            }
        }
    }
</script>

<style lang="scss" scoped>
.strategy-head{
    margin: 25px 0 10px 0;
    .text-h5{
        width: 100%;
        border-bottom: 1px solid #9c9c9c;
        padding-bottom: 10px;
    }
}
    .strategy-desc{
        margin: 5px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #9c9c9c;
        div{
            color: #575757;
        }
        .strategy-desc-items{
            align-items: center;
            padding: 0;
            display: flex;
            justify-content: space-between;
        }
        .strategy-desc-btn{
            padding: 0;
            display: flex;
            justify-content: end;
        }
        .strategy-desc-start{
            padding: 0;
            display: flex;
            justify-content: start;
        }
    }
</style>

<template>
    <v-container fluid>
        <v-card>
            <v-card-text>
                <v-row>
                    <v-col
                            cols="12"
                            sm="2"
                            md="2"
                    >
                        <v-switch
                                v-model="orderMode"
                                label="Order Mode"
                                hide-details
                        ></v-switch>
                    </v-col>
                    <v-col
                            cols="12"
                            sm="8"
                            md="8"
                    >
                        <v-select
                                :items="getStrategiesList"
                                item-text="name"
                                item-value="value"
                                label="Strategy"
                                solo
                                hide-details
                        ></v-select>
                    </v-col>
                    <v-col
                            cols="12"
                            sm="2"
                            md="2"
                    >
                       <p class="font-weight-bold text-end mb-0 mt-3"> Total: {{getTotal}}</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-data-table
                v-if="orderMode"
                item-key="_id"
                :headers="headersOrder"
                :items="getOrdersList"
                :items-per-page="100"
                sort-by="sellDate"
                :sort-desc=true
                class="elevation-1"
        ></v-data-table>
        <v-data-table
                v-else
                item-key="_id"
                :headers="headers"
                :items="getTradesList"
                :items-per-page="100"
                sort-by="date"
                :sort-desc=true
                class="elevation-1"
        ></v-data-table>
    </v-container>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import * as _ from 'lodash'
    export default {
        name: "Trades",
        data(){
          return{
              headers: [
                  { text: 'Action', value: 'action'},
                  { text: 'value', value: 'value'},
                  { text: 'from', value:'from'},
                  { text: 'price', value: 'price' },
                  { text: 'date', value: 'date' }
              ],
              headersOrder: [
                  { text: 'Buy counter', value: 'buyCounter', sortable:false},
                  { text: 'Total Buy Value', value: 'totalBuyValue', sortable:false},
                  { text: 'Max Buy Price', value: 'maxBuyPrice', sortable:false},
                  { text: 'Last Buy', value:'lastBuyDate', sortable:false},
                  { text: 'Sell Price', value: 'sellPrice' , sortable:false},
                  { text: 'Sell From', value: 'sellFrom' , sortable:false},
                  { text: 'Sell Date', value: 'sellDate'},
                  { text: 'Profit USD', value: 'profit' },
                  { text: 'Difference USD', value: 'diff' , sortable:false}
              ],
              orderMode: true
          }
        },
        computed: {
            ...mapGetters([
                'trades', 'strategies'
            ]),
            getTradesList(){
                const trades = _.map(this.trades, (trade)=>{
                    trade.from = this.getFrom(trade.from);
                    trade.date = this.getDate(trade.createdAt);
                    return trade
                });
                return trades
            },
            getOrdersList(){
                let orders = [];
                let order = this.getEmptyOrder();
                _.forEach(this.trades, (trade)=>{
                    if(trade.action === 'BUY'){
                        order.buyCounter+=1;
                        order.totalBuyValue+=Number(Number(trade.value).toFixed(4));
                        order.lastBuyDate=this.getDate(trade.createdAt);
                        if(trade.price> order.maxBuyPrice){
                            order.maxBuyPrice=Number(trade.price.toFixed(4));
                        }
                    }else{
                        order.sellPrice = Number(trade.price.toFixed(4));
                        order.sellDate = this.getDate(trade.createdAt);
                        order.sellFrom = trade.from;
                        order.diff = (trade.price-order.maxBuyPrice).toFixed(4);
                        order.profit = (trade.value-order.totalBuyValue).toFixed(4);
                        orders.push(order);
                        order = this.getEmptyOrder();
                    }
                });
                return orders
            },
            getStrategiesList(){
                return _.map(this.strategies, (strategy)=>{
                   return {
                       name: `${strategy.model} version:${strategy.version}`,
                       value: strategy._id
                   }
                })
            },
            getTotal(){
                return _.reduce(this.getOrdersList, (sum, order)=>{
                    return sum+= Number(order.profit)
                }, 0)
            }
        },
        methods:{
            ...mapActions(["getTrades", "getStrategies"]),
            getFrom(from){
                switch (from) {
                        case 1:
                            return 'Trailing buy';
                        case 2:
                            return 'Stop loss';
                        case 3:
                            return 'Trailing sell';
                        default:
                            return 'Unset';
                }
            },
            getDate(date){
                return new Date(date).toLocaleString()
            },
            getEmptyOrder(){
                return {
                    buyCounter: 0,
                    totalBuyValue: 0,
                    maxBuyPrice: 0,
                    lastBuyDate: null,
                    sellPrice: 0,
                    sellDate: null,
                    sellFrom: null,
                    profit: 0
                }
            }
        },
        mounted() {
            this.getStrategies();
            this.getTrades();
        }
    }
</script>

<style scoped lang="scss">

</style>

<template>
    <v-container>

        <v-row>
            <v-select
                    :items="getStrategiesList"
                    item-text="name"
                    item-value="value"
                    label="Strategy"
                    solo
                    hide-details
            ></v-select>
        </v-row>
        <date-time-picker name="Start" @setTime="setSTime"/>
        <date-time-picker name="End" @setTime="setETime"/>
        <v-row class="my-2 mx-4">
            <v-btn
                    tile
                    @click="startTest"
                    :disabled="!currentModel"
                    color="primary">
                Load data
                <v-icon right>
                    mdi-chevron-triple-right
                </v-icon>
            </v-btn>
        </v-row>
        <v-row v-if="currentModel" class="justify-center my-2">
            <div class="text-h5">Model signals</div>
        </v-row>
        <div v-if="currentModel">
            <model-signals ref="model" :model="currentModel.name" :version="currentModel.value.version" :hours="currentModel.value.hours"/>
        </div>
    </v-container>
</template>

<script>
    import dateTimePicker from "../components/dateTimePicker";
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import modelSignals from "../components/modelSignals";
    import * as _ from 'lodash';

    export default {
        name: "StrategyTest",
        components: {
            dateTimePicker, modelSignals
        },
        data: ()=>({
            currentModel: null,
            models: [
                {name: 'BTCUSD_blockchain_hours_60', version: '1', hours: 60},
            ]
        }),
        methods: {
            ...mapMutations(['setStartTime', 'setEndTime']),
            ...mapActions(['clearData', 'getStrategies']),
            setSTime(time){
                this.setStartTime(time);
            },
            setETime(time){
                this.setEndTime(time);
            },
            startTest(){
                this.clearData();
                this.$refs.model.start();
            }
        },
        computed:{
            ...mapGetters([
                'strategies'
            ]),
            getStrategiesList(){
                return _.map(this.strategies, (strategy)=>{
                    return {
                        name: `${strategy.model} version:${strategy.version}`,
                        value: strategy._id
                    }
                })
            },
        },
        mounted() {
            this.getStrategies();
        }
    };
</script>

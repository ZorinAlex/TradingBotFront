<template>
    <v-container>

                <v-row>
                    <v-select
                         :items="getModelsList"
                         v-model="currentModel"
                         item-text="name"
                         item-value="value"
                         label="Model"
                         return-object
                         outlined
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
    import { mapMutations, mapActions } from 'vuex'
    import modelSignals from "../components/modelSignals";
    import * as _ from 'lodash';

    export default {
        name: "ModelPredictionTest",
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
            ...mapActions(['clearData']),
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
            getModelsList(){
                return _.map(this.models, (model)=>{
                    return {
                        name: `${model.name} version: ${model.version}`,
                        value: model
                    }
                })
            }
        },
        mounted() {

        }
    };
</script>

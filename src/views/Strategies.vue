<template>
    <v-container fluid>
        <v-card v-for="strategy in strategies" :key="strategy._id">
            <v-card-title>
                {{strategy.model}} version: {{strategy.version}}
            </v-card-title>
            <v-card-text>
                <v-row class="mb-5">
                    <v-col cols="12" md="12" class="pb-0">
                        <div class="settings-section"><span>Main Settings</span></div>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                            <v-switch
                                    class="pt-0"
                                    v-model="strategy.isActive"
                                    label="Active"
                                    hide-details
                                    :disabled="!editMode"
                            ></v-switch>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-switch
                                class="pt-0"
                                v-model="strategy.sequential"
                                label="Sequential Trade"
                                hide-details
                                :disabled="!editMode"
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12" class="pb-0">
                        <div class="settings-section"><span>BUY Settings</span></div>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="BUY Confidence"
                                v-model="strategy.buyConfidence"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="BUY Amount"
                                v-model="strategy.buyAmountPercent"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mb-5">
                    <v-col cols="12" md="4" class="pt-0">
                        <v-switch
                                v-model="strategy.trailingBuy"
                                label="Trailing BUY"
                                hide-details
                                :disabled="!editMode"
                        ></v-switch>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="Trailing BUY"
                                v-model="strategy.trailingBuyPercent"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12" class="pb-0">
                        <div class="settings-section"><span>Sell Settings</span></div>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="SELL Confidence"
                                v-model="strategy.sellConfidence"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mb-5">
                    <v-col cols="12" md="4" class="pt-0">
                        <v-switch
                                v-model="strategy.trailingSell"
                                label="Trailing SELL"
                                hide-details
                                :disabled="!editMode"
                        ></v-switch>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="Trailing SELL"
                                v-model="strategy.trailingSellPercent"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12" class="pb-0">
                        <div class="settings-section"><span>Stop Loss Settings</span></div>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-switch
                                v-model="strategy.stopLoss"
                                label="Stop Loss"
                                hide-details
                                :disabled="!editMode"
                        ></v-switch>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-switch
                                v-model="strategy.stopLossIsTrailing"
                                label="Stop Loss Trailing"
                                hide-details
                                :disabled="!editMode"
                        ></v-switch>
                    </v-col>
                    <v-col cols="12" md="4" class="pt-0">
                        <v-text-field
                                label="Stop Loss"
                                v-model="strategy.stopLossPercent"
                                type="number"
                                suffix="%"
                                :disabled="!editMode"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Strategies",
        data: ()=>({
            editMode: false,
        }),
        computed:{
            ...mapGetters([
                'strategies'
            ]),
        },
        methods: {
            ...mapActions(["getStrategies"]),
        },
        mounted() {
            this.getStrategies();
        }
    }
</script>

<style scoped lang="scss">
    .settings-section{
        text-transform: uppercase;
        position: relative;
        z-index: 1;
        &:before{
            border-top: 1px solid #9f9f9f;
            content:"";
            margin: 0 auto;
            position: absolute;
            top: 50%; left: 0; right: 0; bottom: 0;
            width: 95%;
            z-index: -1;
        }
        &>span{
            background: #fff;
            padding: 0 15px 0 0;
        }
    }
</style>

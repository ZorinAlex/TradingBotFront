import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import axios from "axios";
import * as _ from 'lodash';

export default new Vuex.Store({
    state: {
        modelsPredictions: {},
        trades: [],
        wallets: [],
        exchanges: [],
        strategies: [],
        startTime: null,
        endTime: null
    },
    getters: {
        trades: state => state.trades,
        wallets: state => state.wallets,
        exchanges: state => state.exchanges,
        strategies: state => state.strategies
    },
    mutations: {
        setStartTime(state, time) {
            state.startTime = time
        },
        setEndTime(state, time) {
            state.endTime = time
        },
        addPrediction(state, {predictionData, prediction}) {
            const modelData = {
                price: predictionData.data[predictionData.data.length - 1].close,
                action: prediction.data.predictionAction,
                confidence: prediction.data.predictionPercentage,
                time: prediction.data.timestamp
            };
            if (_.has(state.modelsPredictions, predictionData.model) && _.has(state.modelsPredictions[predictionData.model], `version_${predictionData.version}`)) {
                state.modelsPredictions[predictionData.model][`version_${predictionData.version}`].push(modelData)
            } else {
                if (!_.has(state.modelsPredictions, predictionData.model)) {
                    state.modelsPredictions[predictionData.model] = {};
                }
                state.modelsPredictions[predictionData.model][`version_${predictionData.version}`] = [modelData]
            }
        },
        addTrades(state, trades) {
            state.trades = trades
        },
        addWallets(state, wallets) {
            state.wallets = wallets
        },
        addExchanges(state, exchanges){
            state.exchanges = exchanges
        },
        addStrategies(state, strategies){
            state.strategies = strategies
        }
    },
    actions: {
        clearData({state}) {
            state.modelsPredictions = {};
        },
        getPredictionsData({state}, {model, version}) {
            return state.modelsPredictions[model][`version_${version}`]
        },
        async getHoursData({state}, hoursBack) {
            let data = await axios.get(
                `http://localhost:3030/data/hour/${state.startTime - hoursBack * 60 * 60 * 1000}/${state.endTime}`
            );
            return data.data;
        },
        async getMinutesData({}, timestamp) {
            let data = await axios.get(
                `http://localhost:3030/data/${timestamp}/${timestamp + 60 * 60 * 1000}/900`
            );
            return data.data;
        },
        async getTestMinuteDataForHour({}, timestamp) {
            let data = await axios.get(
                `http://localhost:3030/data/${timestamp}/${timestamp + 58 * 60 * 1000}/60`
            );
            return data.data;
        },
        async getPrediction({commit}, predictionData) {
            const prediction = await axios.post("http://localhost:3030/prediction", {
                data: predictionData.data,
                model: predictionData.model,
                version: predictionData.version
            });
            commit('addPrediction', {predictionData, prediction});
            return prediction;
        },
        async getTrades({commit}) {
            const trades = await axios.get("http://161.35.219.177:3030/trade/list");
            commit('addTrades', trades.data)
        },
        async getStrategies({commit}) {
            const strategies = await axios.get("http://localhost:3030/strategy/list");
            commit('addStrategies', strategies.data)
        },
        async getWallets({commit}) {
            const wallets = await axios.get("http://161.35.219.177:3030/wallet/list");
            commit('addWallets', wallets.data)
        },
        async getExchanges({commit}) {
            const exchanges = await axios.get("http://161.35.219.177:3030/exchange/list");
            commit('addExchanges', exchanges.data)
        },
        async getStrategyTest({}, testData) {
            const test = await axios.post("http://localhost:3030/strategy/addTestInput", {
                modelName: testData.modelName,
                modelVersion: testData.modelVersion,
                price: testData.price,
                isFromTicker: testData.isFromTicker,
                predictionData: testData.predictionData
            });
            return test
        },
    },
    modules: {},
});

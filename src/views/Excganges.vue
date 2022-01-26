<template>
    <v-container fluid>
        <v-card v-for="exchange in exchanges" :key="exchange._id">
            <v-card-title>
                <v-row>
                    <v-col>
                        {{exchange.name}}
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <img width="30px" height="30px" :src="getImageURL(exchange.name.toLowerCase())" alt="">
                    </v-col>
                </v-row>

            </v-card-title>
            <v-card-text>
                <div>Minimum BUY: {{exchange.minimumBuyAmount}} USD</div>
                <div>Maker Fee: {{exchange.makerFee}}%</div>
                <div>Taker Fee: {{exchange.takerFee}}%</div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Exchanges",
        computed: {
            ...mapGetters([
                'exchanges'
            ])
        },
        methods:{
            ...mapActions(["getExchanges"]),
            getImageURL(name){
                return require(`@/assets/exchange/${name}.png`)
            }
        },
        mounted() {
            this.getExchanges();
        }
    }
</script>

<style scoped>

</style>

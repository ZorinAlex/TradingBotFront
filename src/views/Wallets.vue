<template>
    <v-container fluid>
        <v-card v-for="wallet in wallets" :key="wallet._id">
            <v-card-title>
                <v-row>
                    <v-col>
                        {{wallet.name}}
                    </v-col>
                    <v-col class="justify-end d-flex">
                        <img class="currency_main" :src="getImageURL(getCurrency(wallet.name, true))" alt="">
                        <img class="currency_pair" :src="getImageURL(getCurrency(wallet.name, false))" alt="">
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <div>{{getCurrency(wallet.name, true)}}: {{wallet.fiat}}</div>
                <div>{{getCurrency(wallet.name, false)}}: {{wallet.crypto}}</div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Wallets",
        computed: {
            ...mapGetters([
                'wallets'
            ])
        },
        methods:{
            ...mapActions(["getWallets"]),
            getCurrency(name, isFiat){
                if(isFiat){
                    return name.split('-')[0]
                }else{
                    return name.split('-')[1]
                }
            },
            getImageURL(name){
                return require(`@/assets/currency/${name}.png`)
            }
        },
        mounted() {
            this.getWallets();
        }
    }
</script>

<style scoped>
    .currency_main{
        width: 30px;
        height: 30px;
        position: relative;
        left: 5px;
        z-index: 100;
    }
    .currency_pair{
        width: 30px;
        height: 30px;
    }
</style>

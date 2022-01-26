<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="5">
                <v-menu
                        ref="date"
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="date"
                                :label="getName('Date')"
                                hint="YYYY/MM/DD format"
                                persistent-hint
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                            v-model="date"
                            no-title
                            @input="setDateTime()"
                    ></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" lg="5">
                <v-menu
                        v-model="timeMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="time"
                                :label="getName('Time')"
                                persistent-hint
                                prepend-icon="mdi-clock-time-four-outline"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-time-picker
                            v-model="time"
                            no-title
                            @input="setDateTime()"
                    ></v-time-picker>
                </v-menu>
            </v-col>
            <v-col class="align-center d-flex">
                <v-btn
                        class="mx-2"
                        icon
                        medium
                        color="grey darken-5"
                        @click="clear()"
                >
                    <v-icon dark>
                        mdi-delete-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import formatDatesToMilliseconds from '../utils/formatDatesToMilliseconds'
    export default {
        name: "dateTimePicker",
        props: ['name'],
        data: ()=>({
            date: null,
            dateMenu: false,
            time: "00:00",
            timeMenu: false,
        }),
        methods:{
            getName(postfix){
                return `${this.name} ${postfix}`
            },
            setDateTime(){
                this.timeMenu = false;
                this.dateMenu = false;
                const time = formatDatesToMilliseconds(this.date, this.time);
                this.$emit('setTime', time);
            },
            clear(){
                this.date = null;
                this.dateMenu= false;
                this.time= "00:00";
                this.timeMenu= false;
                this.$emit('setTime', null);
            }
        }
    }
</script>

<style scoped>

</style>

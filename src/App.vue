<template>
  <v-app>
    <v-navigation-drawer permanent :mini-variant="mini" app>
      <v-list dense>
        <v-list-item @click.stop="mini = !mini" link>
          <v-list-item-icon>
            <v-icon v-show="mini">mdi-chevron-right</v-icon>
            <v-icon v-show="!mini">mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-title></v-list-item-title>
        </v-list-item>
        <v-list-item to="/trades" link>
          <v-list-item-icon>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Trades</v-list-item-title>
        </v-list-item>
        <v-list-item to="/strategies" link>
          <v-list-item-icon>
            <v-icon>mdi-chart-timeline-variant-shimmer</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Trade Strategies</v-list-item-title>
        </v-list-item>
        <v-list-item to="/wallets" link>
          <v-list-item-icon>
            <v-icon>mdi-wallet</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Wallets</v-list-item-title>
        </v-list-item>
        <v-list-item to="/exchanges" link>
          <v-list-item-icon>
            <v-icon>mdi-bank</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Exchanges</v-list-item-title>
        </v-list-item>
        <v-list-item to="/model-prediction-test" link>
        <v-list-item-icon>
          <v-icon>mdi-chart-areaspline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Model Predictions Test</v-list-item-title>
      </v-list-item>
        <v-list-item to="/strategy-test" link>
          <v-list-item-icon>
            <v-icon>mdi-chart-waterfall</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Strategy Test</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark> </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer padless app>
      <v-col
              class="text-center"
              cols="12"
      >
        <strong>ZoTrade Bot Terminal</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    mini: true
  }),
};
</script>

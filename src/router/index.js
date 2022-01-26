import Vue from "vue";
import VueRouter from "vue-router";
import Trades from "../views/Trades";
import Strategies from "../views/Strategies";
import Wallets from "../views/Wallets";
import Excganges from "../views/Excganges";
import ModelPredictionTest from "../views/ModelPredictionTest";
import StrategyTest from "../views/StrategyTest";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: '/wallets'
  },
  {
    path: "/trades",
    name: "Trades",
    component: Trades,
  },
  {
    path: "/strategies",
    name: "Strategies",
    component: Strategies,
  },
  {
    path: "/wallets",
    name: "Wallets",
    component: Wallets,
  },
  {
    path: "/exchanges",
    name: "Exchanges",
    component: Excganges,
  },
  {
    path: "/model-prediction-test",
    name: "ModelPredictionTest",
    component: ModelPredictionTest,
  },
  {
    path: "/strategy-test",
    name: "StrategyTest",
    component: StrategyTest,
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

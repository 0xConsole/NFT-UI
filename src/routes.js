import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Farms = React.lazy(() => import("./views/farms/Farms"));
const Vaults = React.lazy(() => import("./views/vaults/Vaults"));
const Dummy = React.lazy(() => import("./views/dummy/Dummy"));
const Roadmap = React.lazy(() => import("./views/roadmap/Roadmap"));
const Leaderboard = React.lazy(() => import("./views/leaderboard/Leaderboard"));
const Buy = React.lazy(() => import("./views/buy/Buy"));
const NFTs = React.lazy(() => import("./views/nft/NFTs"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/home", name: "Dashboard", component: Dashboard },
  { path: "/farms", name: "Farms", component: Farms },
  { path: "/vaults", name: "Vaults", component: Vaults },
  { path: "/roadmap", name: "Roadmap", component: Roadmap },
  { path: "/pyromaniacs", name: "Leaderboard", component: Leaderboard },
  { path: "/buy", name: "Buy", component: Buy },
  { path: "/nfts", name: "NFTs", component: NFTs },
];

export default routes;

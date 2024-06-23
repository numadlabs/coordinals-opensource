export const rpcUrl = "http://127.0.0.1",
  rpcPort = 18332;

export const maraUrl =
  "http://btc-testnet-wallet.mara.technology:9130/unspents/list?address=&xpub=";

export const fileSizeLimit = 3145728; //3MB in binary

//native segwit
export const outputSize = 31,
  inputSize = 68;

export const ASSETTYPE = {
  TOKEN: 0,
  NFTOFFCHAIN: 1,
  NFTONCHAIN: 2,
};

export const USED_UTXO_KEY = "used_utxo";

export const MOCK_MENOMIC = process.env.MOCK_MENOMIC ?? "";

export const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS ?? "";

export const FEERATE = 1;

export const WALLET_URL =
  "chrome-extension://khebhoaoppjeidmdkpdglmlhghnooijn/index.html";

export const launchpad = [
  {
    id: 1,
    image: "/launchpads/launch_2.png",
    time: {
      day: 89,
      hour: 16,
      minute: 25,
    },
    title: "Void",
    price: 0.04,
    mint: 69,
    total: 420,
  },
  {
    id: 2,
    image: "/launchpads/launch_3.png",

    time: { day: 19, hour: 13, minute: 20 },
    title: "Fantasy",
    price: 0.04,
    mint: 89,
    total: 420,
  },
  {
    id: 3,
    image: "/launchpads/launch_4.png",
    type: "live",
    time: { day: 19, hour: 2, minute: 20 },
    title: "Silver",
    price: 0.04,
    mint: 49,
    total: 420,
  },
  {
    id: 4,
    image: "/launchpads/launch_4.png",
    time: { day: 39, hour: 12, minute: 20 },
    title: "Universe",
    price: 0.04,
    mint: 29,
    total: 420,
  },
  {
    id: 5,
    image: "/launchpads/launch_6.png",
    time: { day: 59, hour: 21, minute: 20 },
    title: "Mercury",
    price: 0.04,
    mint: 19,
    total: 420,
  },
  {
    id: 6,
    image: "/launchpads/launch_7.png",
    time: { day: 19, hour: 19, minute: 20 },
    title: "High on Molly",
    price: 0.04,
    mint: 169,
    total: 420,
  },
  {
    id: 7,
    image: "/launchpads/launch_8.png",
    time: { day: 19, hour: 19, minute: 20 },
    title: "Leanfall",
    price: 0.04,
    mint: 100,
    total: 420,
  },
  {
    id: 8,
    image: "/launchpads/launch_1.png",
    type: "ended",
    time: { day: 19, hour: 19, minute: 20 },
    title: "Trapstar",
    price: 0.04,
    mint: 369,
    total: 420,
  },
];

export const collection = [
  {
    id: 1,
    image: "/launchpads/launch_1.png",
    type: "1h",
    title: "Abstracto",
    price: 0.004,
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",
    floor: 120,
    day: 4,
  },
  {
    id: 2,
    image: "/launchpads/launch_2.png",
    type: "30d",
    title: "Void",
    price: 0.001,
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
  {
    id: 3,
    image: "/launchpads/launch_3.png",
    type: "7d",
    title: "Fantasy",
    price: 0.002,
    volume: 1.69,
    owner: 1.25,
    item: "Abstracto",
    market: 32.76,
    sales: 255,
    listed: 432,
    floor: 120,

    day: 4,
    items: 3.33,
  },
  {
    id: 4,
    image: "/launchpads/launch_4.png",
    type: "24h",
    title: "Silver",
    price: 0.005,
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
  {
    id: 5,
    image: "/launchpads/launch_5.png",
    title: "Universe",
    type: "24h",
    price: 0.006,
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
  {
    id: 6,
    image: "/launchpads/launch_6.png",
    title: "Mercury",
    price: 0.007,
    volume: 1.69,
    type: "24h",
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
  {
    id: 7,
    image: "/launchpads/launch_7.png",
    title: "High on molly",
    price: 0.008,
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    type: "24h",
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
  {
    id: 8,
    image: "/launchpads/launch_8.png",
    title: "Leanfall",
    price: 0.004,
    type: "24h",
    volume: 1.69,
    owner: 1.25,
    items: 3.33,
    market: 32.76,
    sales: 255,
    listed: 432,
    item: "Abstracto",

    floor: 120,

    day: 4,
  },
];

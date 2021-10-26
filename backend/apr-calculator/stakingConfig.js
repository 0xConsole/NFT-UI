
const BASE_Address = "0xf239e69ce434c7fb408b05a0da416b14917d934e";

const farms =
    [
        { ticker: "SHI3LD", address: BASE_Address, type: "token", logo: "logo.png", decimals: 18 },
        { ticker: "WETH", address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", type: "token", logo: "weth.png", decimals: 18 },
        { ticker: "QUICK", address: "0x831753dd7087cac61ab5644b308642cc1c33dc13", type: "token", logo: "quick.png", decimals: 18 },
        { ticker: "WMATIC", address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", type: "token", logo: "wmatic.png", decimals: 18 },
        { ticker: "USDC", address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", type: "token", logo: "usdc.png", decimals: 6 },
        { ticker: "USDC-USDT", address: "0x2cf7252e74036d1da831d11089d326296e64a728", type: "pair", logos: ["usdc.png", "usdt.png"], pairPath: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0xc2132d05d31c914a87c6611c10748aeb04b58e8f", decimals: 18 },
        { ticker: "MATIC-QUICK", address: "0x019ba0325f1988213D448b3472fA1cf8D07618d7", type: "pair", logos: ["wmatic.png", "quick.png"], pairPath: "ETH/0x831753DD7087CaC61aB5644b308642cc1c33Dc13", decimals: 18 },
        { ticker: "USDC-WETH", address: "0x853ee4b2a13f8a742d64c8f088be7ba2131f670d", type: "pair", logos: ["usdc.png", "weth.png"], pairPath: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
        { ticker: "SHI3LD-USDC", address: "0x0CA257A6cae5C89826DAae3BE0A64170e34493C5", type: "pair", logos: ["logo.png", "usdc.png"], pairPath: BASE_Address + "/0x2791bca1f2de4661ed88a30c99a7a9449aa84174", decimals: 12 },
        { ticker: "SHI3LD-MATIC", address: "0x982c1F90381e31e7b7dbbA8708126532B7cb7dF6", type: "pair", logos: ["logo.png", "wmatic.png"], pairPath: BASE_Address + "/ETH", decimals: 18 },
        { ticker: "POWER", address: "0x00d5149cdf7cec8725bf50073c51c4fa58ecca12", type: "token", logo: "power256.png", decimals: 18 },
        { ticker: "POWER-USDC", address: "0x9af0c1eeb61de5630899c224db3d6f3f064da047", type: "pair", logos: ["power256.png", "usdc.png"], pairPath: "0x00d5149cdf7cec8725bf50073c51c4fa58ecca12/0x2791bca1f2de4661ed88a30c99a7a9449aa84174", decimals: 12 },
        { ticker: "PBNB", address: "0x7e9928aFe96FefB820b85B4CE6597B8F660Fe4F4", type: "token", logo: "pbnb.png", decimals: 18 },
        { ticker: "SHI3LD-KOGECOIN", address: "0x1A1Bf82669C8c1E703DAa2562Ec1EA9849259Ab0", type: "pair", logos: ["logo.png", "koge-logo-01.png"], pairPath: BASE_Address + "/0x13748d548D95D78a3c83fe3F32604B4796CFfa23", decimals: 18 },
        { ticker: "PCAKE", address: "0x50F1aaaA99077daF3a4058504F6E979B6B7109AC", type: "token", logo: "cake.png", decimals: 18 },
        { ticker: "ELK", address: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", type: "token", logo: "elk.png", decimals: 18 },
        { ticker: "SHI3LD-ELK", address: "0x4C7C0A328b75C990491edd68fF49D307212fe037", type: "pair", logos: ["logo.png", "elk.png"], pairPath: BASE_Address + "/0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", decimals: 18 },
        { ticker: "WBTC", address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", type: "token", logo: "wbtc.png", decimals: 8 },

    ]

module.exports = {
    BASE_Address:BASE_Address,farms:farms
}
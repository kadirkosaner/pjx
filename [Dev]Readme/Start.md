Kıyafet için örnek bir PlayerState:
:: [Wardrobe] PlayerState [init]
<<nobr>>
/_ Player Wardrobe State _/
<<set $wardrobe = {
equipped: {
top: "crop_black", /_ wardrobe_tops.twee'deki item id _/
bottom: "jeans_blue", /_ wardrobe_bottoms.twee'deki item id _/
bra: "bra_basic",
panty: "panty_basic",
shoes: "sneakers_white",
socks: "socks_white"
},
outfits: [null, null, null, null, null],
owned: []
}>>
<</nobr>>

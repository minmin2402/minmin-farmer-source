export const isLinkShopee = async (url:string)=>{
    if (url.includes("shopee")){
        return true
    }
    return false
}

export const isLinkTiktok = async (url:string)=>{
    if (url.includes("tiktok")){
        return true
    }
    return false
}
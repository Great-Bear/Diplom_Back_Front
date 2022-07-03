export class MetaController {
    currencies = [
        "грн.",
        "$",
        "€"
    ]
    TypeOwners = [
        "Бізнес",
        "Приватне"
    ]
    QualityAds = [
        "Нове",
        "Б/В"
    ]

    public GetCurrenciesByid(idCurrecy : number) : string {
        return this.currencies[idCurrecy - 1];
    }
    public GetTypeOwnersByid(idTypeOwner : number) : string {
        return this.TypeOwners[idTypeOwner - 1];
    }
    public GetQualityAdsByid(idQualityAd : number) : string {
        return this.QualityAds[idQualityAd - 1];
    }
}

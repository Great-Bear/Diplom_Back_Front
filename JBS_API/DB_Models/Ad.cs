using System;
using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Ad
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Describe { get; set; }
        public decimal Price { get; set; }

        public string PhoneNumber { get; set; }
        public bool isNegotiatedPrice { get; set; }
        public bool isDelivery { get; set; }

        public DateTime TimeEnd { get; set; } = DateTime.Now.AddMonths(1);

        public int UserId { get; set; }
        public User User { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int BrendId { get; set; }
        public Brend Brend { get; set; } = null;

        public int StatusAdId { get; set; }
        public StatusAd StatusAd { get; set; }


        public int QualityAdId { get; set; }
        public QualityAd QualityAd { get; set; }

        public int TypeOwnerId { get; set; }
        public TypeOwner TypeOwner { get; set; }


        public int CurrencyId { get; set; }
        public Currency Currency { get; set; }

        public ICollection<Img> Imgs { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Filter_Ad> Filter_Ads { get; set; }


        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Chat> Chats { get; set; }


        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<FavoriteAd> FavoriteAds { get; set; }


    }
}

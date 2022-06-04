using JBS_API.DB_Models;
using System.Collections.Generic;

namespace JBS_API.Response_Model
{
    public class Resp_One_Ad
    {
        public string Title { get; set; }
        public string Describe { get; set; }
        public string Price { get; set; }
        public bool IsError { get; set; }
        public string Error { get; set; }
        public int CountImgs { get; set; }
        public int idOwner { get; set; }
        public int idBrend { get; set; }
        public int idCategory { get; set; }
        public int idCurrency { get; set; }
        public string phoneNumber { get; set; }
        public bool isNegotiatedPrice { get; set; }
        public bool isDelivery { get; set; }
        public int[] Filter_Ads { get; set; }
    }
}

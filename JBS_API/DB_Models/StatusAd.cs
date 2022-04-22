using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class StatusAd
    {

        public int Id { get; set; }
        public string Name { get; set; }

        ICollection<Ad> Ads { get; set; }

    }
}

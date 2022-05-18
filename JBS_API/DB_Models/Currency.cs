using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Currency
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Ad> Ads { get; set; }

    }
}

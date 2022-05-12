using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class FilterValue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int FilterId { get; set; }
        public Filter Filter { get; set; }
        public ICollection<Filter_Ad> Filter_Ads { get; set; }
    }
}

using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Filter
    {
        public int Id { get; set; }
        public string FilterName { get; set; }

        public int TypeFilterId { get; set; }
        public TypeFilter TypeFilter { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<FilterValue> FilterValues { get; set; }
    }
}

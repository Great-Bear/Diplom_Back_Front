using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class FilterName
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Filter> Filters { get; set; }
    }
}

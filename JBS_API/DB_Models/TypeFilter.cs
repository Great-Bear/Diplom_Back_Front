using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class TypeFilter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        ICollection<Filter> Filters { get; set; }
    }
}

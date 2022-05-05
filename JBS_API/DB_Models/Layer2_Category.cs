using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Layer2_Category
    {

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<Layer1_Category> Layer1_Categories { get; set; }
    }
}

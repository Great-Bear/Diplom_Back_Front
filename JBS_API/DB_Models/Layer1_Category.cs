using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Layer1_Category
    {

        public int Id { get; set; }
        public string Name { get; set; }

        public int Layer2_CategoryId { get; set; }
        public Layer2_Category Layer2_Category { get; set; }

        public ICollection<Category> Categories { get; set; }

    }
}

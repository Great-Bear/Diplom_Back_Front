using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int Layer1_CategoryId { get; set; }
        public Layer1_Category Layer1_Category { get; set; }

        public ICollection<Ad> Ads { get; set; }
    }
}

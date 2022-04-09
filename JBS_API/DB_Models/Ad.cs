using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Ad
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Describe { get; set; }
        public decimal Price { get; set; }


        public int UserId { get; set; }
        public User User { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int BrendId { get; set; }
        public Brend Brend { get; set; }

        public ICollection<Img> Imgs { get; set; }


    }
}

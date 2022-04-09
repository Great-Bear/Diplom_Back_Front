using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Img
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsMainImg { get; set; }

        public int AdId { get; set; }
        public Ad Ad { get; set; }

    }
}

using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<User> Users { get; set; }
        public Role()
        {
            Users = new List<User>();
        }

    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace JBS_API.DB_Models
{
    public class Chat
    {
        public int Id { get; set; }
      
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User Seller { get; set; }

   
        public int AdId { get; set; }
        public Ad Ad { get; set; }

        public ICollection<Msg_Chat> Msg_Chats { get; set; }
    }
}

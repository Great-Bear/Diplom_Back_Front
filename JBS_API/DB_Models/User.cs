using System.Collections.Generic;

namespace JBS_API.DB_Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName  { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

        public bool IsConfirmEmail { get; set; } = false;

        public int RoleId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Role Role { get; set; }

        public ICollection<Ad> Ads { get; set; }
        public ICollection<FavoriteAd> FavoriteAds { get; set; }

        public ICollection<Chat> Chats { get; set; }
        public ICollection<Msg_Chat> Msg_Chats { get; set; }

    }
}

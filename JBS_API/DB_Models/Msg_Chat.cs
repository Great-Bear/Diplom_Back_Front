namespace JBS_API.DB_Models
{
    public class Msg_Chat
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public bool isRead { get; set; }

        public int ChatId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Chat Chat { get; set; }

        public int UserId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public User User { get; set; }

    }
}

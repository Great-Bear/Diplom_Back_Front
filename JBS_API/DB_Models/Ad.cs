namespace JBS_API.DB_Models
{
    public class Ad
    {
        public int Id { get; set; }
        public string ImgName { get; set; }
        public string Title { get; set; }
        public string Describe { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }


    }
}

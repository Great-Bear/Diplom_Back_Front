namespace JBS_API.DB_Models
{
    public class Filter_Ad
    {
        public int Id { get; set; }

        public int FilterId { get; set; }
        public Filter Filter { get; set; }

        public int AdId { get; set; }
        public Ad Ad { get; set; }
    }
}

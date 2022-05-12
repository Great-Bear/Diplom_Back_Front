namespace JBS_API.DB_Models
{
    public class Filter_Ad
    {
        public int Id { get; set; }

        public int FilterValueId { get; set; }
        public FilterValue FilterValue { get; set; }

        public int AdId { get; set; }
        public Ad Ad { get; set; }
    }
}

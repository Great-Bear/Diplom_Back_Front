namespace JBS_API.DB_Models
{
    public class FilterValue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int FilterId { get; set; }
        public Filter Filter { get; set; }
    }
}

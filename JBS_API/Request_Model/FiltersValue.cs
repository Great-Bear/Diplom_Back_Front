using System.ComponentModel.DataAnnotations;

namespace JBS_API.Request_Model
{
    public class FiltersValue
    {
        [Required]
        public int IdFilter { get; set; }
        [Required]
        public string MaxValue { get; set; }
        [Required]
        public string MinValue { get; set; }
        [Required]
        public bool UserSlider { get; set; }
        [Required]
        public string[] Values { get; set; }    
    }
}

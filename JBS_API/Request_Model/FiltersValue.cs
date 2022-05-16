using System.ComponentModel.DataAnnotations;

namespace JBS_API.Request_Model
{
    public class FiltersValue
    {
        public int IdFilter { get; set; }
        public string MaxValue { get; set; }
        public string MinValue { get; set; }
        public bool UserSlider { get; set; }
        public string[] Values { get; set; }    
    }
}

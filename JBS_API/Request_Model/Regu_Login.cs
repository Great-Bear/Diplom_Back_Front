using System.ComponentModel.DataAnnotations;

namespace JBS_API.Request_Model
{
    public class Regu_Login
    {
        [Required]
        public string Login { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

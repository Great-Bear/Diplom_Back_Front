using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JBS_API.DB_Models
{
    public class VipAd
    {
        public int countShows { get; set; } = 100;

        [Key]
        [ForeignKey("Ad")]
        public int Id { get; set; }
        public Ad Ad { get; set; }


    }
}

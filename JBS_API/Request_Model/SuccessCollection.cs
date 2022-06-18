using System.Collections;
using System.Linq;

namespace JBS_API.Request_Model
{
    public class SuccessCollection : Success
    {
        public IOrderedQueryable data { get; set; }
    }
}

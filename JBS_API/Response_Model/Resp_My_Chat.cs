using JBS_API.DB_Models;
namespace JBS_API.Response_Model
{
    public class Resp_My_Chat
    {
        public int IdChat { get; set; }
        public bool IsRead { get; set; }
        public int IdOwner { get; set; }
        public string LastMsgChat { get; set; }
    }
}

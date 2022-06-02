using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class MsgChatController : Controller
    {
        DbContext _dbContext;

        public MsgChatController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpPut]
        [Route("CreateMsg")]
        public async Task<JsonResult> CreateMsg(Requ_Msg_Chat newMsg)
        {
            try
            {
                await  _dbContext.Msg_Chats.AddAsync(new Msg_Chat
                {
                    ChatId = newMsg.IdChat,
                    UserId = newMsg.IdUser,
                    Value = newMsg.Value
                });
                await  _dbContext.SaveChangesAsync();

                var msgUser = _dbContext.Msg_Chats.Where(m => m.UserId == newMsg.IdUser);

                var NewMsg = msgUser.Skip(msgUser.Count() - 1).First();

                return Json(new
                {
                    isError = false,
                    Msg  = NewMsg
                });

            }
            catch (Exception ex)
            {

                return Json(new
                {
                    isError = true,
                    Message = ex.Message
                });
            }
        }

        [HttpPut]
        [Route("ReadMsg")]
        public async Task<JsonResult> ReadMsg(int idMsg)
        {
            var msg = _dbContext.Msg_Chats.Where(m => m.Id == idMsg).First();
            msg.isRead = true;
            _dbContext.Msg_Chats.Update(msg);
            await  _dbContext.SaveChangesAsync();

            return Json(
                new
                {
                    isError = false
                });
        }
    }
}

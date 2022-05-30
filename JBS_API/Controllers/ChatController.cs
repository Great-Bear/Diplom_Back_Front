using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using JBS_API.DB_Models;
using System.Threading.Tasks;
using JBS_API.Request_Model;
using System.Collections.Generic;
using JBS_API.Response_Model;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ChatController : Controller
    {
        DbContext _dbContext;

        public ChatController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("GetIdChat")]
        public JsonResult GetIdChat(int idBuyer, int idAd)
        {
            try
            {
                var chat = _dbContext.Chats.FirstOrDefault(c => c.UserId == idBuyer && c.AdId == idAd);

                int idChat = 0;

                if (chat != null)
                {
                    idChat = chat.Id;
                }

                return Json(
                  new
                  {
                      isError = false,
                      idChat = idChat
                  }
                 );

            }
            catch(Exception ex)
            {
                return Json(
                    new
                    {
                        isError = true,
                        Message = ex.Message,
                    }
                   );
            }     
        }

        [HttpPut]
        [Route("CreateChat")]
        public async Task<JsonResult> CreateChat(CreateChat newChat)
        {

            try
            {
                var existChat = _dbContext.Chats.FirstOrDefault(c => c.UserId == newChat.IdBuyer && c.AdId == newChat.IdAd);
                int idChat = 0;

                if (existChat != null)
                {
                    idChat = existChat.Id;
                }
                else
                {
                    await _dbContext.Chats.AddAsync(new Chat { AdId = newChat.IdAd, UserId = newChat.IdBuyer });
                    await _dbContext.SaveChangesAsync();

                    idChat = _dbContext.Chats.Skip( _dbContext.Chats.Count() - 1 ).First().Id;
                }

                return Json(new
                {
                    isError = false,
                    idChat = idChat
                }) ;
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

        [HttpGet]
        [Route("MsgChat")]
        public JsonResult GetMsgChat(int idChat)
        {
            try
            {
                return Json( new
                {
                    isError = false,
                    data = _dbContext.Msg_Chats.Where(c => c.ChatId == idChat)
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isError = true,
                    message = ex.Message
                });
            }
          
        }

        [HttpGet]
        [Route("MyChats")]
        public JsonResult GetMyChats(int idUser)
        {

            var chats = _dbContext.Chats.Where(c => c.Msg_Chats.Count > 0 && (c.UserId == idUser || c.Ad.UserId == idUser)).ToArray();

            var myChatList = new List<Resp_My_Chat>();

            foreach (var itemChat in chats)
            {
                var lastMsg = _dbContext.Msg_Chats.Where(m => m.ChatId == itemChat.Id).ToList().First();

                myChatList.Add(new Resp_My_Chat
                {
                    Chat = itemChat,
                    Msg_Chat = lastMsg
                });
            }

            return Json(myChatList);
        }

    }
}
